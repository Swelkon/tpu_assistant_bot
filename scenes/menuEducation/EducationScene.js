const { Scenes, Markup } = require('telegraf')
const constants = require("../../model/constants")
const defaultAct = require("../../DefaultAct")

const EDUCATION_MARKUP = Markup.keyboard([
    constants.BUTTON_TEXT_CAMPUS,
    constants.BUTTON_TEXT_EDUCATION_PROGRAM,
    constants.BUTTON_TEXT_MAIN_MENU
]).resize(true)

function educationSceneGenerate() {
    const  educationScene = new Scenes.BaseScene( constants.SCENE_ID_EDUCATION )
    educationScene.enter( async (ctx) => {
        await ctx.reply( 'Раздел "Образование"', EDUCATION_MARKUP)
    })

    educationScene.hears(constants.BUTTON_TEXT_CAMPUS, async (ctx) => ctx.scene.enter(constants.SCENE_ID_CAMPUS))


    defaultAct(educationScene, constants.SCENE_ID_MAIN_MENU)
    return  educationScene
}

module.exports =  educationSceneGenerate