import _ from 'lodash'

const STATES = Object.freeze([
  {code: 'AK', name: 'Alaska'},
  {code: 'AL', name: 'Alabama'},
  {code: 'AM', name: 'American Samoa'},
  {code: 'AR', name: 'Arkansas'},
  {code: 'AZ', name: 'Arizona'},
  {code: 'CA', name: 'California'},
  {code: 'CO', name: 'Colorado'},
  {code: 'CT', name: 'Connecticut'},
  {code: 'CZ', name: 'Canal Zone'},
  {code: 'DC', name: 'District of Columbia'},
  {code: 'DE', name: 'Delaware'},
  {code: 'FL', name: 'Florida'},
  {code: 'GA', name: 'Georgia'},
  {code: 'GU', name: 'Guam'},
  {code: 'HI', name: 'Hawaii'},
  {code: 'IA', name: 'Iowa'},
  {code: 'ID', name: 'Idaho'},
  {code: 'IL', name: 'Illinois'},
  {code: 'IN', name: 'Indiana'},
  {code: 'KS', name: 'Kansas'},
  {code: 'KY', name: 'Kentucky'},
  {code: 'LA', name: 'Louisiana'},
  {code: 'MA', name: 'Massachusetts'},
  {code: 'MD', name: 'Maryland'},
  {code: 'ME', name: 'Maine'},
  {code: 'MI', name: 'Michigan'},
  {code: 'MN', name: 'Minnesota'},
  {code: 'MO', name: 'Missouri'},
  {code: 'MP', name: 'Northern Marianas Islands'},
  {code: 'MS', name: 'Mississippi'},
  {code: 'MT', name: 'Montana'},
  {code: 'NC', name: 'North Carolina'},
  {code: 'ND', name: 'North Dakota'},
  {code: 'NE', name: 'Nebraska'},
  {code: 'NH', name: 'New Hampshire'},
  {code: 'NJ', name: 'New Jersey'},
  {code: 'NM', name: 'New Mexico'},
  {code: 'NV', name: 'Nevada'},
  {code: 'NY', name: 'New York'},
  {code: 'OH', name: 'Ohio'},
  {code: 'OK', name: 'Oklahoma'},
  {code: 'OR', name: 'Oregon'},
  {code: 'PA', name: 'Pennsylvania'},
  {code: 'PR', name: 'Puerto Rico'},
  {code: 'RI', name: 'Rhode Island'},
  {code: 'SC', name: 'South Carolina'},
  {code: 'SD', name: 'South Dakota'},
  {code: 'TN', name: 'Tennessee'},
  {code: 'TT', name: 'Trust Territories'},
  {code: 'TX', name: 'Texas'},
  {code: 'UT', name: 'Utah'},
  {code: 'VA', name: 'Virginia'},
  {code: 'VI', name: 'Virgin Islands'},
  {code: 'VT', name: 'Vermont'},
  {code: 'WA', name: 'Washington'},
  {code: 'WI', name: 'Wisconsin'},
  {code: 'WV', name: 'West Virginia'},
  {code: 'WY', name: 'Wyoming'},
])

const US_STATE = _.sortBy(STATES, 'name')

export default US_STATE
