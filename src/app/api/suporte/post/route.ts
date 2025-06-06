import { NextResponse } from "next/server";

export async function POST(request: Request) {
    
    try {
        const formData = await request.formData();

        const file = formData.get('file');
        if (!file) {
            throw { message: "Arquivo não informado, por favor entre em contato com o Suporte" };
        }

        const response = await fetch(`https://uploadsuporte.redebrasilrp.com.br/upload/suporte`, {
            method: 'POST',
            body: formData,
            cache: 'no-store'
        });

        const retornoArquivo = await response.json();

        if (retornoArquivo.error) {
            throw retornoArquivo.error;
        }

        return NextResponse.json(
            { data: retornoArquivo, message: "Arquivo enviado com sucesso" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Erro ao enviar o arquivo:", error);
        return NextResponse.json(error.message, { status: error.status || 500 });
    }
}
