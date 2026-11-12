// A API manda a data como "2026-12-05 19:00". Trocar o espaço por T deixa o texto
// no formato ISO, que todo navegador entende.
export function paraDate(texto: string): Date {
  return new Date(texto.replace(" ", "T"))
}

const doisDigitos = (n: number) => String(n).padStart(2, "0")

// As partes da data que a tela usa separadas: "05", "dez", "sábado", "19h00".
export function partesDaData(texto: string) {
  const data = paraDate(texto)
  return {
    dia: doisDigitos(data.getDate()),
    mes: data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
    semana: data.toLocaleDateString("pt-BR", { weekday: "long" }),
    hora: `${doisDigitos(data.getHours())}h${doisDigitos(data.getMinutes())}`,
  }
}

// "sábado, 05 de dez, 19h00"
export function formatarData(texto: string): string {
  const { dia, mes, semana, hora } = partesDaData(texto)
  return `${semana}, ${dia} de ${mes}, ${hora}`
}

const formatoMoeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

// O valor chega como texto ("25.00"). Number() converte antes de formatar.
export function formatarValor(valor: string): string {
  const numero = Number(valor)
  return numero === 0 ? "Gratuito" : formatoMoeda.format(numero)
}

export function ehGratuito(valor: string): boolean {
  return Number(valor) === 0
}
