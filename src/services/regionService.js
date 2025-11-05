// src/services/regionService.js
import { request } from './http'

// (nếu cần đổi path, cấu hình qua .env)
const EP_PROVINCES = '/locations/provinces'
const EP_DISTRICTS = '/locations/districts'
const EP_WARDS     = '/locations/wards'

export async function getProvinces() {
  const res = await request(EP_PROVINCES, { method: 'GET' })
  const data = res?.data ?? res
  // Chuẩn hoá: [{code, name}]
  return (Array.isArray(data) ? data : []).map(x => ({
    code: x.code ?? x.id,
    name: x.name
  }))
}

export async function getDistricts(provinceCode) {
  const res = await request(EP_DISTRICTS, { method: 'GET', params: { provinceCode } })
  const data = res?.data ?? res
  return (Array.isArray(data) ? data : []).map(x => ({
    code: x.code ?? x.id,
    name: x.name
  }))
}

export async function getWards(districtCode) {
  const res = await request(EP_WARDS, { method: 'GET', params: { districtCode } })
  const data = res?.data ?? res
  return (Array.isArray(data) ? data : []).map(x => ({
    code: x.code ?? x.id,
    name: x.name
  }))
}
