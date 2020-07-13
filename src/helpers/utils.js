export const parseAmount = (amount) => {
    return parseFloat(amount.replace(/(^\$|,)/g,''))
}