import {takeEvery, put, call, select} from 'redux-saga/effects'
import {get} from 'utils/http'
import {
  loadMorePeopleSearchResultsSaga,
  loadMorePeopleSearch,
} from 'sagas/loadMorePeopleSearchResultsSaga'
import {
  selectSearchTermValue,
  selectLastResultsSortValue,
} from 'selectors/peopleSearchSelectors'
import {
  LOAD_MORE_RESULTS,
  loadMoreResults,
  loadMoreResultsSuccess,
  loadMoreResultsFailure,
} from 'actions/peopleSearchActions'

describe('loadMorePeopleSearchResultsSaga', () => {
  it('loads more people search results on LOAD_MORE_RESULTS', () => {
    const peopleSeachResultsSagaGenerator = loadMorePeopleSearchResultsSaga()
    expect(peopleSeachResultsSagaGenerator.next().value).toEqual(
      takeEvery(LOAD_MORE_RESULTS, loadMorePeopleSearch)
    )
  })
})

describe('loadMorePeopleSearch', () => {
  const action = loadMoreResults(false)
  const searchTerm = 'test'
  const lastResultSort = ['last_result_sort']

  it('finds some error during the process', () => {
    const error = 'Something went wrong'
    const peopleSeachGenerator = loadMorePeopleSearch(action)
    expect(peopleSeachGenerator.next().value).toEqual(select(selectSearchTermValue))
    expect(peopleSeachGenerator.next(searchTerm).value).toEqual(select(selectLastResultsSortValue))
    expect(peopleSeachGenerator.next(lastResultSort).value).toEqual(call(get, '/api/v1/people', {
      search_term: searchTerm,
      search_after: lastResultSort,
      is_client_only: false,
    }))
    expect(peopleSeachGenerator.throw(error).value).toEqual(put(loadMoreResultsFailure('Something went wrong')))
  })

  it('loads more people search results successfully', () => {
    const searchResults = {
      hits: {
        hits: [],
      },
    }
    const action = loadMoreResults(false, {
      county: 'Tuolumne',
      city: 'Townville',
      address: '5 Chive Drive',
    })
    const peopleSeachGenerator = loadMorePeopleSearch(action)
    expect(peopleSeachGenerator.next().value).toEqual(select(selectSearchTermValue))
    expect(peopleSeachGenerator.next(searchTerm).value).toEqual(select(selectLastResultsSortValue))
    expect(peopleSeachGenerator.next(lastResultSort).value).toEqual(call(get, '/api/v1/people', {
      search_term: searchTerm,
      search_after: lastResultSort,
      is_client_only: false,
      search_address: {
        county: 'Tuolumne',
        city: 'Townville',
        street: '5 Chive Drive',
      },
    }))
    expect(peopleSeachGenerator.next(searchResults).value).toEqual(put(loadMoreResultsSuccess(searchResults)))
  })
})
