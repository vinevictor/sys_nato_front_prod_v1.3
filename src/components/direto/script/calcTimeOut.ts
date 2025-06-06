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
   // clacular a diferença entre a data de criação e a data atual se for menor de 24horas retornar `${valor} horas`, se for maior de 24horas retornar `${valor} dias`;
   if (!DtAprovacao || !HrAprovacao) {
     const diffTime = Math.abs(dataAtual.getTime() - dataCreate.getTime());
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
     return diffDays > 1 ? `${diffDays} dias` : `${diffDays} hora`;
   };
   //calcular a diferença entre a data de criação e a data de aprovacao
   const dataAprovacao = new Date(`${DtAprovacao.split("T")[0]}T${HrAprovacao.split("T")[1].split(".")[0]}.000Z`);
   const diffTime = Math.abs(dataAprovacao.getTime() - dataCreate.getTime());
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   // se der erro retornar ---
   if (diffDays === Infinity) return "---";
   return diffDays > 1 ? `${diffDays} dias` : `${diffDays} hora`; 
};