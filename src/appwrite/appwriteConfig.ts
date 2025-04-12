import  {Account , Client , Databases} from 'appwrite'

// const project_id = import.meta.env.PROJECT_ID

const client  = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67fa76ba003aea60c2bd')

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases }