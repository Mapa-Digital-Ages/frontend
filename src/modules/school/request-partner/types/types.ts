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
