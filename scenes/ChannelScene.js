const {Scenes, Markup} = require('telegraf')
const Api = require("../model/api/Api");
const DataBus = require("../model/DataBus");


async function channelSceneFunction(ctx) {
    //TODO: Проверка канала ТПУ должна проходить на сервере
    if (DataBus.allowedChannels.includes(ctx.chat.id)) {

        // TODO: [16.12.2021] Не удалять, в дальнейшем - сохранение новостей из телеграм-каналов
        // if (ctx.channelPost) {
        //     if (ctx.channelPost.poll) {
        //
        //         // Handle ServerResponse.status
        //         switch (await DataBus.submitPost({
        //             from_chat_id: ctx.channelPost.sender_chat.id,
        //             message_id: ctx.channelPost.message_id,
        //             date: ctx.channelPost.date,
        //             is_poll: true
        //         })) {
        //             case Api.STATUS_OK:
        //                 console.log("ChannelSceneFunction() | Channel poll saved")
        //                 break
        //             default:
        //                 console.log("ChannelSceneFunction() | Channel poll hasn't been saved")
        //                 break
        //
        //         }
        //
        //     } else {
        //         // Handle ServerResponse.status
        //         switch (await DataBus.submitPost({
        //             from_chat_id: ctx.channelPost.sender_chat.id,
        //             message_id: ctx.channelPost.message_id,
        //             date: ctx.channelPost.date,
        //             is_poll: false
        //         })) {
        //             case Api.STATUS_OK:
        //                 console.log("ChannelSceneFunction() | Channel post saved")
        //                 break
        //             default:
        //                 console.log("ChannelSceneFunction() | Channel post hasn't been saved")
        //                 break
        //
        //         }
        //     }
        // }

    }
}

module.exports = channelSceneFunction