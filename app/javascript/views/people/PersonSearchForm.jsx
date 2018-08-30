import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from 'common/Autocompleter'

export class PersonSearchForm extends React.Component {
  componentWillUnmount() {
    this.props.onClear()
    this.props.onChange('')
  }

  render() {
    const {
      searchAddress,
      searchPrompt,
      ...autocompleterProps
    } = this.props

    return (
      <div>
        <a className='anchor' id='search-card-anchor'/>
        <div className='card double-gap-bottom hidden-print' id='search-card'>
          <div className='card-header'>
            <h2>Search</h2>
          </div>
          <div className='card-body'>
            <div className='row'>
              <div className='col-md-12'>
                <label className='pull-left' htmlFor='screening_participants'>{searchPrompt}</label>
                <Autocompleter id='screening_participants' {...autocompleterProps} searchAddress={searchAddress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PersonSearchForm.propTypes = {
  canCreateNewPerson: PropTypes.bool.isRequired,
  isSelectable: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onLoadMoreResults: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  results: PropTypes.array,
  searchAddress: PropTypes.bool,
  searchPrompt: PropTypes.string.isRequired,
  searchTerm: PropTypes.string,
  staffId: PropTypes.string,
  total: PropTypes.number,
}

export default PersonSearchForm
