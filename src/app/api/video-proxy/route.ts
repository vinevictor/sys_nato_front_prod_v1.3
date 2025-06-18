import { NextRequest, NextResponse } from "next/server";

/**
 * API de proxy para vídeos
 * 
 * Este endpoint atua como um intermediário para contornar problemas de CORS
 * quando tentamos carregar vídeos de domínios externos.
 */
export async function GET(request: NextRequest) {
  try {
    // Obtém a URL do vídeo dos parâmetros da requisição
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json(
        { error: "URL do vídeo não fornecida" },
        { status: 400 }
      );
    }

    console.log(`Proxy de vídeo solicitado para: ${videoUrl}`);

    // Faz a requisição para buscar o vídeo do servidor externo
    const videoResponse = await fetch(videoUrl);
    
    if (!videoResponse.ok) {
      console.error(`Erro ao buscar vídeo. Status: ${videoResponse.status}`);
      return NextResponse.json(
        { error: `Erro ao buscar vídeo. Status: ${videoResponse.status}` },
        { status: videoResponse.status }
      );
    }

    // Configura os headers para permitir CORS e passar os headers relevantes
    const headers = new Headers();
    
    // Copia headers específicos da resposta original
    const contentType = videoResponse.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    
    // Configura os headers CORS
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET");

    // Obtém os dados do vídeo como buffer
    const videoData = await videoResponse.arrayBuffer();

    // Retorna o conteúdo do vídeo com os headers adequados
    return new NextResponse(videoData, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Erro ao processar proxy de vídeo:", error);
    return NextResponse.json(
      { error: "Falha ao processar o vídeo" },
      { status: 500 }
    );
  }
}
