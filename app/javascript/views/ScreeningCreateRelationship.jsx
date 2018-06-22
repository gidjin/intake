import React from 'react'
import {ModalComponent} from 'react-wood-duck'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import SelectField from 'common/SelectField'
import PropTypes from 'prop-types'

const RelationshipTypes = [
  {value: '175', label: 'Aunt/Nephew (Maternal)'},
  {value: '176', label: 'Aunt/Nephew (Paternal)'},
  {value: '177', label: 'Aunt/Niece (Maternal)'},
  {value: '178', label: 'Aunt/Niece (Paternal)'},
  {value: '179', label: 'Brother/Brother'},
  {value: '180', label: 'Brother/Brother (Half)'},
  {value: '181', label: 'Brother/Brother (Step)'},
  {value: '182', label: 'Brother/Sister'},
  {value: '183', label: 'Brother/Sister (Half)'},
  {value: '184', label: 'Brother/Sister (Step)'},
  {value: '185', label: 'Cousin/Cousin (Maternal)'},
  {value: '186', label: 'Cousin/Cousin (Paternal)'},
  {value: '187', label: 'Daughter/De Facto Parent'},
  {value: '188', label: 'Daughter/Father (Adoptive)'},
  {value: '189', label: 'Daughter/Father (Alleged)'},
  {value: '190', label: 'Daughter/Father (Birth)'},
  {value: '191', label: 'Daughter/Father (Foster)'},
  {value: '192', label: 'Daughter/Father (Presumed)'},
  {value: '193', label: 'Daughter/Father (Step)'},
  {value: '194', label: 'Daughter/Mother (Adoptive)'},
  {value: '195', label: 'Daughter/Mother (Alleged)'},
  {value: '196', label: 'Daughter/Mother (Birth)'},
  {value: '197', label: 'Daughter/Mother (Foster)'},
  {value: '198', label: 'Daughter/Mother (Presumed)'},
  {value: '200', label: '* Daughter/Non-Custodial Parent'},
  {value: '201', label: 'De Facto Parent/Daughter'},
  {value: '202', label: 'De Facto Parent/Son'},
  {value: '203', label: 'Father/Daughter (Adoptive)'},
  {value: '204', label: 'Father/Daughter (Alleged)'},
  {value: '205', label: 'Father/Daughter (Birth)'},
  {value: '206', label: 'Father/Daughter (Foster)'},
  {value: '207', label: 'Father/Daughter (Presumed)'},
  {value: '208', label: 'Father/Daughter (Step)'},
  {value: '210', label: 'Father/Son (Alleged)'},
  {value: '211', label: 'Father/Son (Birth)'},
  {value: '212', label: 'Father/Son (Foster)'},
  {value: '213', label: 'Father/Son (Presumed)'},
  {value: '214', label: 'Father/Son (Step)'},
  {value: '215', label: 'Godchild/Godparent'},
  {value: '216', label: 'Godparent/Godchild'},
  {value: '217', label: 'Granddaughter/Grandparent (Maternal)'},
  {value: '218', label: 'Granddaughter/Grandparent (Paternal)'},
  {value: '219', label: 'Granddaughter/Great Grandparent (Matrnl)'},
  {value: '220', label: 'Granddaughter/Great Grandparent (Patrnl)'},
  {value: '221', label: 'Grandparent/Granddaughter (Maternal)'},
  {value: '222', label: 'Grandparent/Granddaughter (Paternal)'},
  {value: '223', label: 'Grandparent/Grandson (Maternal)'},
  {value: '224', label: 'Grandparent/Grandson (Paternal)'},
  {value: '225', label: 'Grandson/Grandparent (Maternal)'},
  {value: '226', label: 'Grandson/Grandparent (Paternal)'},
  {value: '227', label: 'Grandson/Great Grandparent (Maternal)'},
  {value: '228', label: 'Grandson/Great Grandparent (Paternal)'},
  {value: '229', label: 'Great Aunt/Niece (Maternal)'},
  {value: '230', label: 'Great Aunt/Niece (Paternal)'},
  {value: '231', label: 'Great Grandparent/Granddaughter (Matrnl)'},
  {value: '232', label: 'Great Grandparent/Granddaughter (Patrnl)'},
  {value: '233', label: 'Great Grandparent/Grandson (Maternal)'},
  {value: '234', label: 'Great Grandparent/Grandson (Paternal)'},
  {value: '235', label: 'Great Uncle/Niece (Maternal)'},
  {value: '236', label: 'Great Uncle/Niece (Paternal)'},
  {value: '237', label: 'Great-Aunt/Nephew (Maternal)'},
  {value: '238', label: 'Great-Aunt/Nephew (Paternal)'},
  {value: '239', label: 'Great-Uncle/Nephew (Maternal)'},
  {value: '240', label: 'Great-Uncle/Nephew (Paternal)'},
  {value: '241', label: 'Guardian/Ward'},
  {value: '242', label: 'Indian Child/Indian Custodian'},
  {value: '243', label: 'Indian Custodian/Indian Child'},
  {value: '244', label: 'Live-in/Live-in'},
  {value: '245', label: 'Mother/Daughter (Adoptive)'},
  {value: '246', label: 'Mother/Daughter (Alleged)'},
  {value: '247', label: 'Mother/Daughter (Birth)'},
  {value: '248', label: 'Mother/Daughter (Foster)'},
  {value: '249', label: 'Mother/Daughter (Step)'},
  {value: '250', label: 'Mother/Son (Adoptive)'},
  {value: '251', label: 'Mother/Son (Alleged)'},
  {value: '252', label: 'Mother/Son (Birth)'},
  {value: '253', label: 'Mother/Son (Foster)'},
  {value: '254', label: 'Mother/Son (Step)'},
  {value: '255', label: 'Nephew/Aunt (Maternal)'},
  {value: '256', label: 'Nephew/Aunt (Paternal)'},
  {value: '257', label: 'Nephew/Great-Aunt (Maternal)'},
  {value: '258', label: 'Nephew/Great-Aunt (Paternal)'},
  {value: '259', label: 'Nephew/Great-Uncle (Maternal)'},
  {value: '260', label: 'Nephew/Great-Uncle (Paternal)'},
  {value: '261', label: 'Nephew/Uncle (Maternal)'},
  {value: '262', label: 'Nephew/Uncle (Paternal)'},
  {value: '263', label: 'Niece/Aunt (Maternal)'},
  {value: '264', label: 'Niece/Aunt (Paternal)'},
  {value: '265', label: 'Niece/Great Aunt (Maternal)'},
  {value: '266', label: 'Niece/Great Aunt (Paternal)'},
  {value: '267', label: 'Niece/Great Uncle (Maternal)'},
  {value: '268', label: 'Niece/Great Uncle (Paternal)'},
  {value: '269', label: 'Niece/Uncle (Maternal)'},
  {value: '270', label: 'Niece/Uncle (Paternal)'},
  {value: '271', label: 'No Relation/No Relation'},
  {value: '272', label: '* Non-Custodial Parent/Daughter'},
  {value: '273', label: '* Non-Custodial Parent/Son'},
  {value: '274', label: 'Other Relative/Other Relative'},
  {value: '275', label: 'Significant Other/Significant Other'},
  {value: '276', label: 'Sister/Brother'},
  {value: '277', label: 'Sister/Brother (Half)'},
  {value: '278', label: 'Sister/Brother (Step)'},
  {value: '279', label: 'Sister/Sister'},
  {value: '280', label: 'Sister/Sister (Half)'},
  {value: '281', label: 'Sister/Sister (Step)'},
  {value: '282', label: 'Son/De Facto Parent'},
  {value: '283', label: 'SSon/Father (Adoptive)'},
  {value: '284', label: 'Son/Father (Alleged)'},
  {value: '285', label: 'Son/Father (Birth)'},
  {value: '286', label: 'Son/Father (Foster)'},
  {value: '287', label: 'Son/Father (Presumed)'},
  {value: '288', label: 'Son/Father (Step)'},
  {value: '289', label: 'Son/Mother (Adoptive)'},
  {value: '290', label: 'Son/Mother (Alleged)'},
  {value: '291', label: 'Son/Mother (Birth)'},
  {value: '292', label: 'Son/Mother (Foster)'},
  {value: '293', label: 'Son/Mother (Step)'},
  {value: '294', label: '* Son/Non-Custodial Parent'},
  {value: '295', label: 'Spouse/Spouse'},
  {value: '296', label: 'Uncle/Nephew (Maternal)'},
  {value: '297', label: 'Uncle/Nephew (Paternal)'},
  {value: '298', label: 'Uncle/Niece (Maternal)'},
  {value: '299', label: 'Uncle/Niece (Paternal)'},
  {value: '300', label: 'Unknown/Unknown'},
  {value: '301', label: 'Ward/Guardian'},
  {value: '5620', label: 'Mother/Daughter (Presumed)'},
  {value: '5993', label: 'Child/Residential Facility Staff'},
  {value: '5994', label: 'Residential Facility Staff/Child'},
  {value: '6360', label: 'Son/Mother (Presumed)'},
  {value: '6361', label: 'Mother/Son (Presumed)'},
]

export default class ScreeningCreateRelationship extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false}
    this.handleShowModal = this.handleShowModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.modalTable = this.modalTable.bind(this)
  }

  handleShowModal() {
    this.setState({
      show: !this.state.show,
    })
  }

  closeModal() {
    this.setState({
      show: false,
    })
  }

  modalTable(data) {
    return (
      <BootstrapTable data={data}>
        <TableHeaderColumn dataField='focus_person' dataAlign='center'>Focus Person</TableHeaderColumn>
        <TableHeaderColumn dataField='relationship' dataFormat={this.selectFieldFormat}> Relationship<br/>
          <div className='text-helper'>Focus Person / Related Person</div>
        </TableHeaderColumn>
        <TableHeaderColumn dataField='related_person' isKey={true}
          dataAlign='center'
        >Related Person</TableHeaderColumn>
      </BootstrapTable>
    )
  }

  modalTitle() {
    return (<b>
      Create Relationship Type
    </b>)
  }

  selectFieldFormat() {
    return (
      <SelectField
        id='change_relationship_type'
        label=''
      >
        <option key=''/>
        {RelationshipTypes.map((relationship) => <option key={relationship.value} value={relationship.value}>{relationship.label}</option>)}
      </SelectField>
    )
  }

  modalFooter() {
    return (
      <button aria-label='Create Relationship' className='pull-right btn btn-primary'>
      Create Relationship
      </button>
    )
  }

  render() {
    return (
      <div className='container'>
        <button onClick={this.handleShowModal}>
            Create Relationship
        </button>
        <ModalComponent
          closeModal={this.closeModal}
          showModal={this.state.show}
          modalBody={this.modalTable(this.props.data)}
          modalFooter={this.modalFooter()}
          modalSize='large'
          modalTitle={'Create Relationship'}
        />
      </div>
    )
  }
}

ScreeningCreateRelationship.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    focus_person: PropTypes.string,
    related_person: PropTypes.string,
  })),
}