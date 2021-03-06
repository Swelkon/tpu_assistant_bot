const User = require('./data/User')
const StudentInfo = require('./data/StudentInfo')
const Api = require('./api/Api')
const constants = require("./constants");
const vacancies = require("./mockdata/vacancies");
const Lesson = require("./data/Lesson");

class DataBus {

    static get numOfNews() {
        return DataBus.polls.length + DataBus.posts.length + DataBus.vacancies.length
    }

    static polls = []
    static posts = []
    // static vacancies = []
    static vacancies = vacancies
    static allowedChannels = [-1001614453874]

    // Метод для получения данных о пользователе через Api
    static async retrieveUser({ctx, chat_id, telegram_token}) {
        try {
            const serverResponse = await Api.retrieveUser({
                chat_id: chat_id,
                telegram_token: telegram_token
            })

            if (serverResponse.status === Api.STATUS_AUTH_NEEDED) {
                ctx.scene.enter(constants.SCENE_ID_START,)
            } else {

                // If status is OK
                if (serverResponse.status === Api.STATUS_OK) {
                    const user = serverResponse.data
                    console.log("DataBus/retrieveUser: user retrieved:", user)

                    ctx.session.user = new User({
                        last_name: user.last_name,
                        first_name: user.first_name,
                        email: user.email,
                        chat_id: chat_id,
                        is_student: user.is_student,
                        telegram_token: telegram_token
                    })
                }
            }


            return serverResponse.status
        } catch (e) {
            console.log("DataBus/retrieveUser: Error: Could not retrieve user information:", e)
            return Api.STATUS_SERVER_ERROR
        }

    }

    static getUser({ctx}) {
        return ctx.session.user
    }

    static async retrieveStudentInfo({ctx, chat_id, telegram_token}) {
        try {
            const serverResponse = await Api.retrieveStudentInfo({
                chat_id: chat_id,
                telegram_token: telegram_token
            })
            console.log("DataBus/retrieveStudentInfo: student info retrieved:", serverResponse)

            ctx.session.studentInfo = null

            // If status is OK
            if (serverResponse.status === Api.STATUS_OK) {
                const studentInfo = serverResponse.data

                ctx.session.studentInfo = new StudentInfo({
                    gruppa: studentInfo.gruppa,
                    gradebook_number: studentInfo.gradebook_number,
                    department: studentInfo.department,
                    status: studentInfo.status,
                    direction_of_training: studentInfo.direction_of_training,
                    form_of_education: studentInfo.form_of_education,
                    type_of_financing: studentInfo.type_of_financing,
                })
            }
            return serverResponse.status
        } catch (e) {
            console.log("DataBus/retrieveStudentInfo: Error: Could not retrieve student information:", e)
            return Api.STATUS_SERVER_ERROR
        }
    }

    static getStudentInfo({ctx}) {
        return ctx.session.studentInfo
    }


    static async submitPost({telegram_token, from_chat_id, message_id, date, is_poll}) {
        try {
            const serverResponse = await Api.submitPost({
                telegram_token: telegram_token,
                from_chat_id: from_chat_id,
                message_id: message_id,
                date: date,
                is_poll: is_poll
            })

            if (serverResponse.status === Api.STATUS_OK) {
                console.log("DataBus/submitPost: saved successfully:", serverResponse)
                DataBus.retrievePosts()
            }

            return serverResponse.status
        } catch (e) {
            console.log(e)
            return Api.STATUS_SERVER_ERROR
        }

    }


    static async retrievePosts() {
        try {
            const serverResponse = await Api.retrievePosts()
            if (serverResponse.status === Api.STATUS_OK) {
                const allPosts = serverResponse.data
                const textPosts = allPosts.filter((post) => !post.is_poll)
                const polls = allPosts.filter((post) => post.is_poll)

                DataBus.updateTextPosts({posts: textPosts})
                DataBus.updatePolls({polls: polls})
            }

            return serverResponse.status
        } catch (e) {
            console.log("DataBus/retrievePosts: Error! Could not retrieve posts:", e)
            return Api.STATUS_SERVER_ERROR
        }
    }


    static async retrieveUserTimetable({ctx, chat_id, telegram_token}) {
        try {
            const serverResponse = await Api.retrieveTimetable({chat_id, telegram_token})

            if (serverResponse.status === Api.STATUS_OK) {
                const lessons = []
                const responseLessons = serverResponse.data
                responseLessons.forEach((l) => {
                    lessons.push(new Lesson(l.id, l.start, l.end, l.tip, l.place, l.event, l.disciplina, l.lichnost))
                })

                // ctx.session.user.userTimetable = lessons
                ctx.session.userTimetable = lessons
            }

            return serverResponse.status

        } catch (e) {
            console.log("DataBus/retrieveUserTimetable: Error! Could not timetable for the user:", e)
            return Api.STATUS_SERVER_ERROR
        }
    }

    static getUserTimetable({ctx}) {
        // return ctx.session.user.userTimetable
        return ctx.session.userTimetable
    }


    static updateTextPosts({posts}) {
        this.posts = posts
    }

    static updatePolls({polls}) {
        this.polls = polls
    }


    static async getFAQAnswer(text) {
        try {
            const serverResponse = await Api.retrieveFAQAnswer(text)
            const FAQResponse = serverResponse.data
            console.log(serverResponse)
            console.log(FAQResponse)

            const answer = FAQResponse.answers[0].answer.toString();

            return {
                status: serverResponse.status,
                answer: answer
            }

        } catch (e) {
            return {
                status: Api.STATUS_SERVER_ERROR,
                answer: null
            }
        }
    }

    static async sendMessageToOthers({ctx, chat_id, telegram_token, message_id}) {

        try {
            const serverResponse = await Api.retrieveTelegramChatIds({chat_id, telegram_token})

            let chat_ids = []

            if (serverResponse.status === Api.STATUS_OK) {
                chat_ids = serverResponse.data
            }
            console.log(chat_ids)

            for (const chat of chat_ids) {
                if (chat.telegram_chat_id && chat.telegram_chat_id !== 0) {
                    await ctx.telegram.forwardMessage(chat.telegram_chat_id, chat_id, message_id)
                    await sleep(30)
                }
            }

            return serverResponse.status

        } catch (e) {
            console.log("DataBus/sendMessageToOthers: Error! Could not sent message:", e)
            return Api.STATUS_SERVER_ERROR
        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = DataBus
