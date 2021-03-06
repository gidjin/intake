import {connect} from 'react-redux'
import {
  getIsApproximateAgeDisabledSelector,
  getPersonDemographicsSelector,
} from 'selectors/screening/personDemographicsFormSelectors'
import {setField} from 'actions/peopleFormActions'
import {MAX_LANGUAGES} from 'common/LanguageInfo'
import PersonDemographicsForm from 'views/people/PersonDemographicsForm'

const mapStateToProps = (state, {personId}) => (
  {
    approximateAgeIsDisabled: getIsApproximateAgeDisabledSelector(state, personId),
    ...getPersonDemographicsSelector(state, personId).toJS(),
  }
)

const mapDispatchToProps = (dispatch, {personId}) => ({
  onChange: (field, value) => {
    switch (field) {
      case 'languages': {
        const trimmedLanguages = value.slice(0, MAX_LANGUAGES).map((languages) => languages.value) || []
        dispatch(setField(personId, ['languages'], trimmedLanguages))
        break
      }
      case 'date_of_birth': {
        dispatch(setField(personId, [field], value))
        dispatch(setField(personId, ['approximate_age'], null))
        dispatch(setField(personId, ['approximate_age_units'], null))
        break
      }
      default: {
        dispatch(setField(personId, [field], value))
      }
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonDemographicsForm)
