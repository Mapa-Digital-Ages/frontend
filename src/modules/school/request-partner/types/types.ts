export type CreateSponsorshipRequestPayload = {
  title: string
  description: string
  requestedSpots: number
}

export type SponsorshipRequestApi = {
  id: string
  school_id: string
  title: string
  description: string | null
  requested_spots: number
  remaining_spots: number
  status: string
  created_at: string
}

export type SchoolPartnershipApi = {
  id: string
  school_id: string
  company_id: string
  company_name: string
  request_id: string
  request_title: string
  granted_spots: number
  status: string
  created_at: string
}
