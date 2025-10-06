/**
 * 
 * @param DtCreate data de criação
 * @param DtAprovacao data de aprovacao
 * @param HrAprovacao hora de aprovacao
 * @returns string
 */
export const calcTimeOut = (DtCreate: string, DtAprovacao: string | null, HrAprovacao: string | null) => {
    const dataAtual = new Date();
    const dataCreate = new Date(DtCreate);
    // Adiciona 3 horas para ajustar ao horário de Brasília
    dataCreate.setHours(dataCreate.getHours() + 3);

   // clacular a diferença entre a data de criação e a data atual se for menor de 24horas retornar `${valor} horas`, se for maior de 24horas retornar `${valor} dias`;
   if (!DtAprovacao || !HrAprovacao) {
     const diffTime = Math.abs(dataAtual.getTime() - dataCreate.getTime());
     const diffMinutes = Math.floor(diffTime / (1000 * 60));
     const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

     if (diffMinutes < 60) return `${diffMinutes} minutos`;
     if (diffHours < 24) return `${diffHours} horas`;
     return `${diffDays} dias`;
   };
   //calcular a diferença entre a data de criação e a data de aprovacao
   const dataAprovacao = new Date(`${DtAprovacao.split("T")[0]}T${HrAprovacao.split("T")[1].split(".")[0]}.000Z`);
   const diffTime = Math.abs(dataAprovacao.getTime() - dataCreate.getTime());
   const diffMinutes = Math.floor(diffTime / (1000 * 60));
   const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

   // se der erro retornar ---
   if (diffDays === Infinity) return "---";

   if (diffMinutes < 60) return `${diffMinutes} minutos`;
   if (diffHours < 24) return `${diffHours} horas`;
   return `${diffDays} dias`;
};