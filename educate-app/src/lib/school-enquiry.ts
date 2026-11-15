/**
 * The licence enquiry form at /schools: field limits shared by the form and
 * POST /api/school-enquiries, so the browser and the server agree.
 */
export const ENQUIRY_ROLES = [
  'Teacher',
  'Head of department',
  'Senior leader',
  'IT or data protection lead',
  'Trust or local authority',
  'Other',
] as const;

export const ENQUIRY_LIMITS = {
  name: 120,
  organisation: 200,
  email: 254,
  message: 2000,
  maxStudents: 200_000,
} as const;
