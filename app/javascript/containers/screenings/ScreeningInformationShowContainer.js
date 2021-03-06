import {connect} from 'react-redux'
import {getErrorsSelector} from 'selectors/screening/screeningInformationShowSelectors'
import ScreeningInformationShow from 'views/ScreeningInformationShow'
import {dateTimeFormatter} from 'utils/dateFormatter'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import REPORT_TYPE from 'enums/ReportType'

const mapStateToProps = (state) => {
  const screening = state.get('screening')
  return {
    errors: getErrorsSelector(state).toJS(),
    name: screening.get('name'),
    assignee: screening.get('assignee'),
    report_type: REPORT_TYPE[screening.get('report_type')],
    communication_method: COMMUNICATION_METHOD[screening.get('communication_method')],
    started_at: dateTimeFormatter(screening.get('started_at')),
    ended_at: dateTimeFormatter(screening.get('ended_at')),
  }
}

export default connect(mapStateToProps, {})(ScreeningInformationShow)
