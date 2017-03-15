import AddressesEditView from 'components/people/AddressesEditView'
import DateField from 'components/common/DateField'
import Gender from 'Gender'
import Immutable from 'immutable'
import InputField from 'components/common/InputField'
import React from 'react'
import SelectField from 'components/common/SelectField'
import nameFormatter from 'utils/nameFormatter'

const ParticipantEditView = ({participant, onCancel, onChange, onDelete, onSave}) => (
  <div className='card edit double-gap-top' id={`participants-card-${participant.get('id')}`}>
    <div className='card-header'>
      <span>{nameFormatter(participant)}</span>
      <button aria-label='Delete participant'
        className='pull-right delete-button'
        onClick={() => onDelete(participant.get('id'))}
      >
        <i className='fa fa-times' />
      </button>
    </div>
    <div className='card-body'>
      <div className='row'>
        <InputField
          gridClassName='col-md-6'
          labelClassName='no-gap'
          id='first_name'
          label='First Name'
          value={participant.get('first_name') || ''}
          onChange={(event) => onChange(['first_name'], event.target.value || null)}
        />
        <InputField
          gridClassName='col-md-6'
          labelClassName='no-gap-top-desktop'
          id='last_name'
          label='Last Name'
          value={participant.get('last_name') || ''}
          onChange={(event) => onChange(['last_name'], event.target.value || null)}
        />
      </div>
      <div className='row'>
        <DateField
          gridClassName='col-md-6'
          id='date_of_birth'
          label='Date of birth'
          value={participant.get('date_of_birth') || ''}
          onChange={(event) => onChange(['date_of_birth'], event.target.value || null)}
        />
        <SelectField
          gridClassName='col-md-6'
          id='gender'
          label='Gender'
          value={participant.get('gender') || ''}
          onChange={(event) => onChange(['gender'], event.target.value || null)}
        >
          <option key='' value='' />
          {Object.keys(Gender).map((item) => <option key={item} value={item}>{Gender[item]}</option>)}
        </SelectField>
      </div>
      <div className='row'>
        <InputField
          gridClassName='col-md-6'
          id='ssn'
          label='Social security number'
          value={participant.get('ssn') || ''}
          onChange={(event) => onChange(['ssn'], event.target.value || null)}
        />
      </div>
      <AddressesEditView
        addresses={participant.get('addresses') || Immutable.List()}
        onChange={(addresses) => onChange(['addresses'], addresses || [])}
      />
      <div className='row'>
        <div className='centered'>
          <button className='btn btn-primary' onClick={onSave}>Save</button>
          <button className='btn btn-default' onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)

ParticipantEditView.propTypes = {
  onCancel: React.PropTypes.func,
  onChange: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onSave: React.PropTypes.func,
  participant: React.PropTypes.object.isRequired,
}
export default ParticipantEditView
