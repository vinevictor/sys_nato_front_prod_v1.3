// Adiciona um "ouvinte" para o evento 'push'
self.addEventListener('push', event => {
  // Pega os dados que o seu backend enviou (geralmente em formato JSON)
  const data = event.data.json();

  const title = data.title || 'Nova Notificação';
  const options = {
    body: data.body || 'Algo novo aconteceu!',
    icon: '/sisnatologo.png', // Caminho para um ícone na pasta public
    // Guardamos a URL aqui para usar depois
    data: {
      url: data.url
    }
  };

  // Pede para o navegador mostrar a notificação
  event.waitUntil(self.registration.showNotification(title, options));
});

// Ouvinte para quando o usuário clica na notificação
self.addEventListener('notificationclick', event => {
  const urlParaAbrir = event.notification.data.url;
  event.notification.close();

  // Manda o navegador abrir a URL correta
  event.waitUntil(
    clients.openWindow(urlParaAbrir)
  );
});