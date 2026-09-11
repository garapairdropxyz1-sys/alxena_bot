/**
 * AIRich helpers for ALXENA-BOT.
 *
 * Uses the AIRich implementation bundled with @sairidev/baileys-new so the
 * message contains the botMetadata/verification envelope required by
 * WhatsApp clients to render richResponseMessage (including embedded_screens).
 */

import { proto } from '@sairidev/baileys-new'
import { wrapToBotForwardedMessage } from '@sairidev/baileys-new/lib/Utils/rich-message-utils.js'

export const createAIRichHTMLResponse = ({
   sections = [],
   embeddedScreens = [],
   responseId = crypto.randomUUID()
} = {}) => ({
   response_id: responseId,
   sections,
   embedded_screens: embeddedScreens
})

export const encodeAIRich = (responseData) =>
   Buffer.from(JSON.stringify(responseData))

export const sendAIRich = async (sock, jid, responseData, options = {}) => {
   const responseId = responseData?.response_id || crypto.randomUUID()
   const data = encodeAIRich({ ...responseData, response_id: responseId })

   const richResponseMessage = proto.AIRichResponseMessage.create({
      messageType: proto.AIRichResponseMessageType.AI_RICH_RESPONSE_TYPE_STANDARD,
      submessages: options.submessages ?? [{
         messageType: 2,
         messageText: options.messageText ?? '> ALXENA'
      }],
      unifiedResponse: { data },
      contextInfo: {
         forwardingScore: 1,
         isForwarded: true,
         forwardedAiBotMessageInfo: {
            botJid: options.botJid ?? '867051314767696@bot'
         },
         forwardOrigin: 4
      }
   })

   const content = wrapToBotForwardedMessage(richResponseMessage)

   // The bundled helper adds the verification metadata required for AIRich.
   content.messageContextInfo.botMetadata.botResponseId = responseId

   return sock.sendMessage(jid, {
      raw: true,
      ...content
   }, options.sendOptions)
}
