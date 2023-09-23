const token = ''
const baseURL = ''
const financialURL = ''

const URL = (company, report_type, statement_type) => ({
  info: `/keystats/ratio/v1/${company}`,
  financial: `/findata-view/company/financial?symbol=${company}&data_type=1&report_type=${report_type}&statement_type=${statement_type}`,
})

const REPORT_TYPE = {
  roe: 1,
  per: 1,
  eps: 1,
  netIncome: 1,
  pbv: 2,
}

export default {
  token,
  baseURL,
  financialURL,
  REPORT_TYPE,
  URL,
}