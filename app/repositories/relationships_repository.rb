# frozen_string_literal: true

# RelationshipsRepository is a service class responsible for retrieval of
# relationships via the API
class RelationshipsRepository
  def self.find_by_screening_id(security_token, screening_id)
    relationships_path = ExternalRoutes.intake_api_relationships_by_screening_path(screening_id)
    response = IntakeAPI.make_api_call(
      security_token,
      relationships_path,
      :get
    )
    response.body
  end

  def self.search(security_token, client_ids)
    return [] if client_ids.blank?

    FerbAPI.make_api_call(
      security_token,
      FerbRoutes.relationships_path,
      :get,
      clientIds: client_ids
    ).body
  end
end
