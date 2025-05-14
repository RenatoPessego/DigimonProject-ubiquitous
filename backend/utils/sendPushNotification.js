const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(pushToken, title, body) {
  console.log('📨 [Push] Tentando enviar notificação...');
  console.log('🎯 Token recebido:', pushToken);

  if (!Expo.isExpoPushToken(pushToken)) {
    console.warn('❌ Token inválido:', pushToken);
    return;
  }

  try {
    const messages = [{
      to: pushToken,
      sound: 'default',
      title,
      body,
    }];

    console.log('📦 Conteúdo do push:', messages[0]);

    const receipt = await expo.sendPushNotificationsAsync(messages);
    console.log('✅ Notificação enviada com sucesso:', receipt);
  } catch (err) {
    console.error('❌ Erro ao enviar notificação:', err);
  }
}

module.exports = sendPushNotification;