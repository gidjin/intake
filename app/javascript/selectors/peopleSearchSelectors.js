import {Map, List, fromJS} from 'immutable'
import {findByCode} from 'selectors'
import {createSelector} from 'reselect'

const getPeopleSearchSelector = (state) => state.get('peopleSearch')
export const getSearchTermValueSelector = (state) => (
  getPeopleSearchSelector(state).get('searchTerm')
)
export const getResultsTotalValueSelector = (state) => (
  getPeopleSearchSelector(state).get('total')
)
export const getLastResultsSortValueSelector = (state) => {
  const lastResult = getPeopleSearchSelector(state).get('results').last()
  return lastResult.get('sort').toJS()
}

export const getResultLanguagesSelector = (state, result) => createSelector(
  (state) => state.get('languages'),
  () => (result.get('languages') || List()),
  (statusCodes, languages) => (
    languages
      .sort((item) => item.get('primary'))
      .map((language) => (
        findByCode(statusCodes.toJS(), language.get('id')).value)
      )

  )
)(state)

export const getIsSensitiveSelector = (result) => (result.get('sensitivity_indicator', '').toUpperCase() === 'S')
export const getIsSealedSelector = (result) => (result.get('sensitivity_indicator', '').toUpperCase() === 'R')

export const getResultRacesSelector = (state, result) => createSelector(
  (state) => state.get('ethnicityTypes'),
  (state) => state.get('raceTypes'),
  (state) => state.get('unableToDetermineCodes'),
  () => (result.getIn(['race_ethnicity', 'race_codes']) || List()),
  () => result.get('unable_to_determine_code'),
  (ethnicityTypes, raceTypes, unableToDetermineCodes, races, unableToDetermineCode) => {
    if (unableToDetermineCode) {
      return List([findByCode(unableToDetermineCodes.toJS(), unableToDetermineCode).value])
    } else {
      return races
        .map((race) => (Map({
          race: findByCode(raceTypes.toJS(), race.get('id')).value,
          race_detail: findByCode(ethnicityTypes.toJS(), race.get('id')).value,
        })))
    }
  }
)(state)

export const getResultEthnicitiesSelector = (state, result) => createSelector(
  (state) => state.get('hispanicOriginCodes'),
  () => (result.getIn(['race_ethnicity', 'hispanic_codes']) || List()),
  () => (result.getIn(['race_ethnicity', 'hispanic_origin_code'])),
  (hispanicOriginCodes, ethnicities, hispanicLatinoOriginCode) => fromJS({
    hispanic_latino_origin: findByCode(hispanicOriginCodes.toJS(), hispanicLatinoOriginCode).value,
    ethnicity_detail: ethnicities.map((ethnicity) => ethnicity.get('description')).toJS(),
  })
)(state)

const formatSSN = (ssn) => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
export const getPeopleResultsSelector = (state) => getPeopleSearchSelector(state)
  .get('results')
  .map((result) => {
    const address = result.getIn(['addresses', 0], null)
    const phoneNumber = result.getIn(['phone_numbers', 0], null)
    return Map({
      firstName: result.getIn(['highlight', 'first_name'], result.get('first_name')),
      lastName: result.getIn(['highlight', 'last_name'], result.get('last_name')),
      middleName: result.get('middle_name'),
      nameSuffix: result.get('name_suffix'),
      legacyDescriptor: result.get('legacy_descriptor'),
      gender: result.get('gender'),
      languages: getResultLanguagesSelector(state, result),
      races: getResultRacesSelector(state, result),
      ethnicity: result.get('ethnicity'),
      dateOfBirth: result.getIn(['highlight', 'date_of_birth'], result.get('date_of_birth')),
      ssn: formatSSN(result.getIn(['highlight', 'ssn'], result.get('ssn'))),
      address: address && Map({
        city: address.get('city'),
        state: address.get('state'),
        streetAddress: address.get('street_address'),
        type: '', // TODO: Implement as part of #INT-537
        zip: address.get('zip'),
      }),
      phoneNumber: phoneNumber && Map({
        number: phoneNumber.get('number'),
        type: phoneNumber.get('type'),
      }),
      isSensitive: getIsSensitiveSelector(result),
      isSealed: getIsSealedSelector(result),
    })
  })
