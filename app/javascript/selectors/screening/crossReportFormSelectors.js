import {
  AGENCY_TYPES,
  COMMUNITY_CARE_LICENSING,
  COUNTY_LICENSING,
  CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS,
  DISTRICT_ATTORNEY,
  LAW_ENFORCEMENT,
} from 'enums/CrossReport'
import {
  isRequiredIfCreate,
  combineCompact,
} from 'utils/validator'
import {
  getAgencyRequiredErrors,
  getCommunityCareLicensingErrors,
  getCountyLicensingErrors,
  getDistrictAttorneyErrors,
  getLawEnforcementErrors,
} from 'selectors/screening/crossReportShowSelectors'
import {createSelector} from 'reselect'
import {fromJS, List, Map} from 'immutable'
import {selectParticipantsForFerb} from 'selectors/participantSelectors'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {selectCounties} from 'selectors/systemCodeSelectors'
import {areCrossReportsRequired} from 'utils/allegationsHelper'

export const getDistrictAttorneyFormSelector = (state) => (state.getIn(['crossReportForm', DISTRICT_ATTORNEY]) || Map())
export const getLawEnforcementFormSelector = (state) => (state.getIn(['crossReportForm', LAW_ENFORCEMENT]) || Map())
export const getCountyLicensingFormSelector = (state) => (state.getIn(['crossReportForm', COUNTY_LICENSING]) || Map())
export const getCommunityCareLicensingFormSelector = (state) => (state.getIn(['crossReportForm', COMMUNITY_CARE_LICENSING]) || Map())

const getSelectedAgenciesSelector = createSelector(
  getCommunityCareLicensingFormSelector,
  getCountyLicensingFormSelector,
  getDistrictAttorneyFormSelector,
  getLawEnforcementFormSelector,
  (communityCareLicensing, countyLicensing, districtAttorney, lawEnforcement) => fromJS({
    [COMMUNITY_CARE_LICENSING]: communityCareLicensing,
    [COUNTY_LICENSING]: countyLicensing,
    [DISTRICT_ATTORNEY]: districtAttorney,
    [LAW_ENFORCEMENT]: lawEnforcement,
  }).filter((agencyForm, _type) => agencyForm.get('selected'))
    .reduce((agencies, agencyForm, type) => (
      agencies.push(fromJS({type, code: agencyForm.getIn(['agency', 'value'])}))
    ), List())
)

export const getScreeningWithEditsSelector = createSelector(
  getScreeningSelector,
  (state) => state.getIn(['crossReportForm', 'county_id', 'value']) || null,
  (state) => state.getIn(['crossReportForm', 'inform_date', 'value']) || null,
  (state) => state.getIn(['crossReportForm', 'method', 'value']) || null,
  getSelectedAgenciesSelector,
  selectParticipantsForFerb,
  (
    screening,
    county_id,
    inform_date,
    method,
    agencies,
    participants
  ) => {
    const hasFormData = county_id || inform_date || method || agencies && agencies.length > 0
    let crossReports = screening.get('cross_reports')
    const hasCrossReport = crossReports && crossReports.length > 0

    if (!hasFormData && !hasCrossReport) {
      return screening.set('participants', participants)
    }

    if (hasFormData && !hasCrossReport) {
      crossReports = new List()
      crossReports.push({})
      screening.set('cross_reports', crossReports)
    }
    return screening
      .setIn(['cross_reports', 0, 'county_id'], county_id)
      .setIn(['cross_reports', 0, 'inform_date'], inform_date)
      .setIn(['cross_reports', 0, 'method'], method)
      .setIn(['cross_reports', 0, 'agencies'], agencies)
      .set('participants', participants)
  }
)

export const getErrorsSelector = createSelector(
  (state) => state.getIn(['crossReportForm', 'inform_date', 'value']),
  (state) => state.getIn(['crossReportForm', 'method', 'value']),
  getSelectedAgenciesSelector,
  (state) => state.get('allegationsForm'),
  (informDate, method, agencies, allegations) => fromJS({
    inform_date: combineCompact(isRequiredIfCreate(informDate, 'Please enter a cross-report date.', () => (agencies.size !== 0))),
    method: combineCompact(isRequiredIfCreate(method, 'Please select cross-report communication method.', () => (agencies.size !== 0))),
    [COMMUNITY_CARE_LICENSING]: combineCompact(() => (getCommunityCareLicensingErrors(agencies))),
    [COUNTY_LICENSING]: combineCompact(() => (getCountyLicensingErrors(agencies))),
    [DISTRICT_ATTORNEY]: combineCompact(() => (
      getDistrictAttorneyErrors(agencies) ||
      getAgencyRequiredErrors(DISTRICT_ATTORNEY, agencies, allegations)
    )),
    [LAW_ENFORCEMENT]: combineCompact(() => (
      getLawEnforcementErrors(agencies) ||
      getAgencyRequiredErrors(LAW_ENFORCEMENT, agencies, allegations)
    )),
  })
)

export const getTouchedAgenciesSelector = createSelector(
  (state) => state.get('crossReportForm'),
  (crossReportForm) => crossReportForm.filter((field) => field.getIn(['agency', 'touched'])).keySeq()
)
export const getTouchedFieldsSelector = createSelector(
  (state) => state.get('crossReportForm'),
  (crossReportForm) => crossReportForm.filter((field) => field.get('touched')).keySeq()
)

export const getVisibleErrorsSelector = createSelector(
  getErrorsSelector,
  getTouchedFieldsSelector,
  getTouchedAgenciesSelector,
  (state) => state.get('allegationsForm'),
  (errors, touchedFields, touchedAgencies, allegations) => {
    const needsCrossReports = areCrossReportsRequired(allegations)

    return errors.reduce((filteredErrors, fieldErrors, field) => {
      const isTouchedAgency = touchedAgencies.includes(field)
      const isTouchedField = touchedFields.includes(field)
      if (isTouchedAgency || (isTouchedField && (needsCrossReports || !AGENCY_TYPES[field]))) {
        return filteredErrors.set(field, fieldErrors)
      }
      return filteredErrors.set(field, List())
    }, Map())
  }
)

export const getAllegationsRequireCrossReportsValueSelector = createSelector(
  getSelectedAgenciesSelector,
  (state) => state.get('allegationsForm'),
  (agencies, allegations) => areCrossReportsRequired(allegations) && !CROSS_REPORTS_REQUIRED_FOR_ALLEGATIONS.reduce((hasRequiredAgencies, requiredAgencyType) => hasRequiredAgencies && Boolean(agencies.find((agency) => (
    agency.get('type') === requiredAgencyType
  ))), true)
)

export const getUserCountySelector = (state) => {
  const userCountyName = state.getIn(['userInfo', 'county'])
  const counties = selectCounties(state)
  const foundCounty = counties.find((county) => county.get('value') === userCountyName)
  return foundCounty ? foundCounty.get('code') : null
}
