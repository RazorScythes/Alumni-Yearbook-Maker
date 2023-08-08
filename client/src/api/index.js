import axios from 'axios'

require('dotenv').config()

const API = axios.create({ baseURL: `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN_NAME}:${process.env.REACT_APP_DATABASE_PORT}/admin`})
const User_API = axios.create({ baseURL: `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_DOMAIN_NAME}:${process.env.REACT_APP_DATABASE_PORT}`})

const headers = {
    'content-type': 'multipart/form-data'
}
// API.interceptors.request.use((req) => {
//     if (localStorage.getItem('profile')) {
//       req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
//     }
//     return req;
// });

/*
    HOME PAGE
*/
export const searchQuery            = (keyword) => User_API.post('/home/searchQuery', keyword)
export const getQuery               = (keyword) => User_API.post('/home/getQuery', keyword)
export const getAcademicYear        = () => User_API.get('/home/batch_year')
export const getGraduates           = (id) => User_API.post('/home/graduates', id)
export const getHomeContent         = (year) => User_API.post('/home', year)
export const getCommence            = (id) => User_API.post('/home/commence', id)
export const getAlumniProfile       = (id) => User_API.post('/home/alumni', id)
export const getDownloads           = (id) => User_API.post('/home/downloads', id)
export const getBatchGallery        = (id) => User_API.post('/home/getBatchGallery', id)
export const getEvent               = (id) => User_API.post('/home/event', id)
export const getNew                 = (id) => User_API.post('/home/news', id)
export const getAllEvent            = (keyword) => User_API.post('/home/getAllEvent', keyword)
export const getOrderData           = (data) => User_API.post('/home/order', data)
export const preOrder               = (data) => User_API.post('/home/pre_order', data)
export const cancelOrder            = (data) => User_API.post('/home/cancel_order', data)
export const changeAlumniPassword   = (form) => User_API.post('/home/changeAlumniPassword', form)
export const changeEmail            = (email) => User_API.post('/home/changeEmail', email)
export const newMessage             = (form) => User_API.post('/home/newMessage', form)

/*
    OVERVIEW
*/
export const getOverviewData        = () => API.get('/alumni')
export const getStudentQuery        = (keyword) => API.post('/alumni/search', keyword)
export const getNotification        = () => API.get('/alumni/notification')
export const updateNotification     = (arr) => API.post('/alumni/updateNotification', arr)

/*
    ORDER
*/
export const getOrders              = () => API.get('/orders/getOrders')
export const setStatusReleasing     = (id) => API.post('/orders/setStatusReleasing', id)
export const setStatusOK            = (id) => API.post('/orders/setStatusOK', id)

/*
    MESSAGE
*/
export const getAllMessage          = () => API.get('/inbox/getAllMessage')
export const updateAllMessage       = (arr) => API.post('/inbox/updateAllMessage', arr)
export const replyMessage           = (form) => API.post('/inbox/replyMessage', form)
export const removeMessage          = (form) => API.post('/inbox/removeMessage', form)

/*
    BATCH YEAR
*/
export const checkYear = (year) => API.post('/academic_year/check_year', year)

export const fetchBatchYear         = () => API.get('/academic_year/getBatchYear')
export const fetchCurrentBatchYear  = () => API.get('/academic_year/current_year')
export const fetchTemplate          = () => API.get('/template')
export const fetchFrame             = () => API.get('/frame')
export const fetchBanner            = () => API.get('/banner')
export const fetchCover             = () => API.get('/cover')
export const fetchNametags          = () => API.get('/nametags')
export const getCategoryType        = (type) => API.post('/academic_year/category', type)
export const removeDesign           = (obj) => API.post('/academic_year/removeDesign', obj)

export const createTemplate         = (template) => API.post('/template/addTemplate', template, {headers})
export const createFrame            = (frame) => API.post('/frame/addFrame', frame, {headers})
export const createBanner           = (banner) => API.post('/banner/addBanner', banner, {headers})
export const createCover            = (cover) => API.post('/cover/addCover', cover, {headers})
export const createNametags         = (nametags) => API.post('/nametags/addNametags', nametags, {headers})
export const createBatchYear        = (batch) => API.post('/academic_year/addBatch', batch)
export const editBatchYear          = (batch, id) => API.patch(`/academic_year/editBatch/${id}`, batch)
export const deleteBatchYear        = (id) => API.delete(`/academic_year/deleteBatch/${id}`)

/*
    INSTITUTE
*/
export const uploadInstitute        = (inst) => API.post('/institute/uploadInstitute', inst)
export const editInstitute          = (inst) => API.post('/institute/editInstitute', inst)
export const deleteInstitute        = (id) => API.post('/institute/deleteInstitute', id)
export const getInstitute           = () => API.get('/institute/getInstitute')
export const fetchInstituteCounts   = (inst) => API.post('/institute/getInstituteCounts', inst)
export const fetchSectionCounts     = (inst) => API.post('/institute/getSectionCounts', inst)
export const fetchAlumniList        = (inst) => API.post('/institute/getAlumniList', inst)
export const fetchSearchQuery       = (inst) => API.post('/institute/getSearchQuery', inst)
export const getSearchAlumni        = (student_number) => API.post('/institute/editAlumni', student_number)

export const checkSectionExists     = (inst) => API.post('/institute/checkSectionExists', inst)
export const createSection          = (inst) => API.post('/institute/createSection', inst)
export const uploadFile             = (inst) => API.post('/institute/uploadFile', inst, {headers})
export const uploadFileOnSection    = (inst) => API.post('/institute/uploadFileOnSection', inst, {headers})
export const delete_section         = (inst) => API.post('/institute/deleteSection', inst)
export const checkStudentExists     = (inst) => API.post('/institute/checkStudentExists', inst)
export const uploadAlumni           = (inst) => API.post('/institute/uploadAlumni', inst, {headers})
export const updateAlumni           = (inst) => API.patch('/institute/updateAlumni', inst, {headers})
export const deleteAlumni           = (inst) => API.post('/institute/deleteAlumni', inst)

export const bulkImage              = (inst) => API.post('/institute/bulkImage', inst, {headers})

/*
    GALLERY
*/
export const getAllYear             = ()    => API.get('/gallery/getAllYear')
export const getLatestGallery       = ()    => API.get('/gallery/getLatestGallery')
export const getGallery             = (id)  => API.post('/gallery/getGallery', id)
export const uploadOnDrop           = (data)  => API.post('/gallery/uploadOnDrop', data)
export const removeImage            = (id)  => API.post('/gallery/removeImage', id)

/*
    GRADUATION MESSAGE
*/
export const getCommenceYear        = (year) => API.get('/commence/', year)
export const getCommenceData        = () => API.get('/commence/getCommenceData')
export const uploadMessage          = (form) => API.post('/commence/uploadMessage', form)
export const editMessage            = (form) => API.post('/commence/editMessage', form)
export const deleteMessage          = (id) => API.post('/commence/deleteMessage', id)

export const fetchPosition          = () => API.get('/commence/getPosition')
export const addPosition            = (form) => API.post('/commence/addPosition', form)
export const editPosition           = (form) => API.post('/commence/editPosition', form)
export const deletePosition         = (id) => API.post('/commence/deletePosition', id)

/*
    EVENTS AND NEWS
*/
export const getEventYear           = (year) => API.get('/events/', year)

export const getEvents              = ()     => API.get('/events/getEvents ')
export const uploadEvents           = (form) => API.post('/events/uploadEvents', form)
export const editEvents             = (form) => API.post('/events/editEvents', form)
export const deleteEvents           = (id)   => API.post('/events/deleteEvents', id)

export const getNews                = ()     => API.get('/events/getNews ')
export const uploadNews             = (form) => API.post('/events/uploadNews', form)
export const editNews               = (form) => API.post('/events/editNews', form)
export const deleteNews             = (id)   => API.post('/events/deleteNews', id)

/*
    PDF YEARBOOK CONTROL 
*/
export const getPDFYear              = (year) => API.get('/pdf/', year)
export const getPDFList              = (year) => API.post('/pdf/files/', year)
export const generateBatchYearbook   = (id)   => API.post('/pdf/generateBatchYearbook/', id)
export const generateSectionYearbook = (id)   => API.post('/pdf/generateSectionYearbook/', id)
export const enableLink              = (id)   => API.post('/pdf/enableLink/', id)
export const disableLink             = (id)   => API.post('/pdf/disableLink/', id)
export const setActive               = (year)   => API.post('/pdf/setActive/', year)
export const setInactive             = (year)   => API.post('/pdf/setInactive/', year)

/*
    ADMINISTRATORS
*/
export const addAdministration      = (title) => API.post('/administrators/addAdministration/', title)
export const editAdministration     = (title) => API.post('/administrators/editAdministration/', title)
export const deleteAdministration   = (form) => API.post('/administrators/deleteAdministration/', form)
export const getAdminYear           = () => API.get('/administrators/')
export const getLatestContent       = (content) => API.post('/administrators/getLatestContent/', content)
export const getAdminContent        = (content) => API.post('/administrators/getAdminContent/', content)
export const getAdministrators      = (year) => API.post('/administrators/getAdministrators/', year)
export const uploadAdministrators   = (data) => API.post('/administrators/uploadAdministrators/', data)
export const updateAdministrators   = (data) => API.patch('/administrators/updateAdministrators/', data)
export const deleteAdministrators   = (data) => API.post('/administrators/deleteAdministrators/', data)

/*
    HONORS AND AWARDS
*/
export const addHonorTitle          = (form) => API.post('/honor-and-awards/addHonorTitle', form)
export const editHonorTitle         = (form) => API.post('/honor-and-awards/editHonorTitle', form)
export const deleteHonorTitle       = (id) => API.post('/honor-and-awards/deleteHonorTitle', id)
export const getHAYear              = () => API.get('/honor-and-awards/')
export const getHA                  = (year) => API.post('/honor-and-awards/getHA/', year)
export const uploadHA               = (data) => API.post('/honor-and-awards/uploadHA/', data)
export const updateHA               = (data) => API.patch('/honor-and-awards/updateHA/', data)
export const deleteHA               = (data) => API.post('/honor-and-awards/deleteHA/', data)

/*
    Sign in
*/
export const SignIn                 = (formData) => API.post('/auth/signin', formData)
export const ResetPassword          = (email) => API.post('/auth/ResetPassword', email)
export const checkResetConfirmation = (id) => API.post('/auth/checkResetConfirmation', id)
export const newPassword            = (form) => API.post('/auth/newPassword', form)

/*
    Profile
*/

export const changePassword         = (formData, id) => API.post('/profile/changePassword', formData, id)
export const updateName             = (form) => API.post('/profile/updateName', form)

/*
    Manage Accounts
*/

export const getAccountRole         = () => API.get('/accounts/')
export const getAccounts            = (role) => API.post('/accounts/getAccounts', role)
export const uploadAccount          = (data) => API.post('/accounts/uploadAccount/', data)
export const updateAccount          = (data) => API.patch('/accounts/updateAccount/', data)
export const deleteAccount          = (data) => API.post('/accounts/deleteAccount/', data)

export const confirmDeletion        = (password) => API.post('/accounts/confirmDeletion/', password)
export const sendGmail              = (email) => API.post('/accounts/sendGmail/', email)