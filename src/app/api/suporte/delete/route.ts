import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    
    try {
        const fileName = await request.json();

        const response = await fetch(`https://uploadsuporte.redebrasilrp.com.br/delete/suporte/${fileName.image}`, {
            method: 'DELETE',
        });
        
        const retornoArquivo = await response.json();

        if (retornoArquivo.error) {
            throw retornoArquivo.error;
        }

        return NextResponse.json(
            { data: retornoArquivo, message: "Arquivo deletado com sucesso" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Erro ao deletar o arquivo:", error);
        return NextResponse.json(error.message, { status: error.status || 500 });
    }
}
