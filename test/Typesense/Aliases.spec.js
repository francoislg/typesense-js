import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Typesense from '../../src/Typesense'
import ApiCall from '../../src/Typesense/ApiCall'
import axios from 'axios'
import MockAxiosAdapter from 'axios-mock-adapter'

let expect = chai.expect
chai.use(chaiAsPromised)

describe('Aliases', function () {
  let typesense
  let aliases
  let apiCall
  let mockAxios
  before(function () {
    typesense = new Typesense.Client({
      'masterNode': {
        'host': 'master',
        'port': '8108',
        'protocol': 'http',
        'apiKey': 'abcd'
      }
    })
    aliases = typesense.aliases()
    apiCall = new ApiCall(typesense.configuration)
    mockAxios = new MockAxiosAdapter(axios)
  })

  describe('.upsert', function () {
    it('upserts an alias', function (done) {
      mockAxios
        .onPut(
          apiCall._uriFor('/aliases/books'),
          {
            'collection_name': 'books_january'
          },
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.masterNode.apiKey
          }
        )
        .reply(201, {})

      let returnData = aliases.upsert('books', {
        'collection_name': 'books_january'
      })

      expect(returnData).to.eventually.deep.equal({}).notify(done)
    })
  })

  describe('.retrieve', function () {
    it('retrieves all aliases', function (done) {
      mockAxios
        .onGet(
          apiCall._uriFor('/aliases'),
          undefined,
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-TYPESENSE-API-KEY': typesense.configuration.masterNode.apiKey
          }
        )
        .reply(200, [])

      let returnData = aliases.retrieve()

      expect(returnData).to.eventually.deep.equal([]).notify(done)
    })
  })
})
