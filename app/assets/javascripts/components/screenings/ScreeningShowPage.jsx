import * as screeningActions from 'actions/screeningActions'
import AllegationsCardView from 'components/screenings/AllegationsCardView'
import CrossReportCardView from 'components/screenings/CrossReportCardView'
import DecisionCardView from 'components/screenings/DecisionCardView'
import HistoryCard from 'components/screenings/HistoryCard'
import Immutable from 'immutable'
import IncidentInformationCardView from 'components/screenings/IncidentInformationCardView'
import NarrativeCardView from 'components/screenings/NarrativeCardView'
import ParticipantCardView from 'components/screenings/ParticipantCardView'
import PropTypes from 'prop-types'
import React from 'react'
import ScreeningInformationCardView from 'components/screenings/ScreeningInformationCardView'
import WorkerSafetyCardView from 'components/screenings/WorkerSafetyCardView'
import {IndexLink, Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {mapStateToProps} from 'components/screenings/ScreeningEditPage'
import {sortedAllegationsList, removeInvalidAllegations} from 'utils/allegationsHelper'

export class ScreeningShowPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loaded: false,
      screening: props.screening,
      screeningEdits: Immutable.Map(),
      participantsEdits: Immutable.Map(),
    }
    this.cancelEdit = this.cancelEdit.bind(this)
    this.cardSave = this.cardSave.bind(this)
    this.deleteParticipant = this.deleteParticipant.bind(this)
    this.setField = this.setField.bind(this)
    this.saveParticipant = this.saveParticipant.bind(this)
    this.setParticipantField = this.setParticipantField.bind(this)
    this.cancelParticipantEdit = this.cancelParticipantEdit.bind(this)
    this.mergeScreeningWithEdits = this.mergeScreeningWithEdits.bind(this)
  }

  componentDidMount() {
    this.props.actions.fetchScreening(this.props.params.id)
      .then(() => this.setState({loaded: true}))
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.screening.equals(nextProps.screening)) {
      this.setState({screening: nextProps.screening})
    }
  }

  setField(fieldSeq, value, callback) {
    const screeningEdits = this.state.screeningEdits.setIn(fieldSeq, value)
    this.setState({screeningEdits: screeningEdits}, callback)
  }

  cardSave(fieldList) {
    let screening
    if (fieldList.includes('allegations')) {
      const allegations = sortedAllegationsList(
        this.props.screening.get('id'),
        this.props.participants,
        this.props.screening.get('allegations'),
        this.state.screeningEdits.get('allegations')
      ).filterNot((allegation) => allegation.get('allegation_types').isEmpty())

      screening = this.state.screening.set('allegations', allegations)
    } else {
      const changes = this.state.screeningEdits.filter((value, key) =>
        fieldList.includes(key) && value !== undefined
      )
      screening = this.mergeScreeningWithEdits(changes)
    }
    return this.props.actions.saveScreening(screening.toJS())
  }

  cancelEdit(fieldList) {
    const updatedEdits = this.state.screeningEdits.filterNot((value, key) => fieldList.includes(key))
    this.setState({screeningEdits: updatedEdits})
  }

  deleteParticipant(id) {
    this.props.actions.deleteParticipant(id)
  }

  setParticipantField(id, value) {
    const participantsEdits = this.state.participantsEdits.set(id, value)
    this.setState({participantsEdits: participantsEdits})
  }

  cancelParticipantEdit(id) {
    const updatedParticipantsEdits = this.state.participantsEdits.delete(id)
    this.setState({participantsEdits: updatedParticipantsEdits})
  }

  saveParticipant(participant) {
    return this.props.actions.saveParticipant(participant.toJS())
      .then(() => {
        this.props.actions.fetchScreening(this.props.params.id)
        this.setField(['allegations'], removeInvalidAllegations(participant, this.state.screeningEdits.get('allegations')))
      })
  }

  mergeScreeningWithEdits(changes) {
    // Changes in lists are already applied and returned in `changes`.
    // No need to merge old list with new list.
    const lists = changes.filter((val) => Immutable.List.isList(val))
    const nonlists = changes.filterNot((val) => Immutable.List.isList(val))
    let screening = this.state.screening
    lists.map((v, k) => {
      screening = screening.set(k, v)
    })
    return screening.mergeDeep(nonlists)
  }

  participants() {
    // We want to merge the keys of each participant, but we don't want deep merge
    // to combine the address lists for us. So, we do a custom merge at one level deep.
    const mergedParticipants = this.props.participants.map((participant) => {
      const participantId = participant.get('id')
      const relevantEdits = this.state.participantsEdits.get(participantId)
      const participantEdits = (relevantEdits || Immutable.Map())
      return participant.merge(participantEdits)
    })

    return mergedParticipants
  }

  renderParticipantsCard() {
    const participants = this.participants()

    return (
      <div>
        {
          participants.map((participant) =>
            <ParticipantCardView
              key={participant.get('id')}
              onCancel={this.cancelParticipantEdit}
              onDelete={this.deleteParticipant}
              onChange={this.setParticipantField}
              onSave={this.saveParticipant}
              participant={participant}
              mode='show'
            />
          )
        }
      </div>
    )
  }

  render() {
    const {params} = this.props
    const {loaded, screening} = this.state
    const mergedScreening = this.mergeScreeningWithEdits(this.state.screeningEdits)
    return (
      <div>
        <h1>{`Screening #${mergedScreening.get('reference')}`}</h1>
        { loaded &&
          <ScreeningInformationCardView
            mode='show'
            screening={mergedScreening}
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
          />
        }
        {this.renderParticipantsCard()}
        {
          loaded &&
            <NarrativeCardView
              mode='show'
              narrative={mergedScreening.get('report_narrative')}
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
            />
        }
        {
          loaded &&
            <IncidentInformationCardView
              mode='show'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
              screening={mergedScreening}
            />
        }
        {
          loaded &&
            <AllegationsCardView
              mode='show'
              allegations={sortedAllegationsList(
                screening.get('id'),
                this.props.participants,
                screening.get('allegations'),
                this.state.screeningEdits.get('allegations')
              )}
              onCancel={this.cancelEdit}
              onSave={this.cardSave}
              setField={this.setField}
            />
        }
        {
          loaded &&
          <WorkerSafetyCardView
            mode='show'
            screening={mergedScreening}
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
          />
        }
        <HistoryCard
          actions={this.props.actions}
          involvements={this.props.involvements}
          participants={this.props.participants}
          screeningId={params.id}
        />
        {
          loaded &&
            <CrossReportCardView
              crossReport={mergedScreening.get('cross_reports')}
              mode='show'
              onCancel={this.cancelEdit}
              onChange={this.setField}
              onSave={this.cardSave}
            />
        }
        {
          loaded &&
          <DecisionCardView
            mode='show'
            onCancel={this.cancelEdit}
            onChange={this.setField}
            onSave={this.cardSave}
            screening={mergedScreening}
          />
        }
        <IndexLink to='/' className='gap-right'>Home</IndexLink>
        <Link to={`/screenings/${params.id}/edit`}>Edit</Link>
      </div>
    )
  }
}

ScreeningShowPage.propTypes = {
  actions: PropTypes.object.isRequired,
  involvements: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  participants: PropTypes.object.isRequired,
  screening: PropTypes.object.isRequired,
}

function mapDispatchToProps(dispatch, _ownProps) {
  return {
    actions: bindActionCreators(screeningActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningShowPage)
