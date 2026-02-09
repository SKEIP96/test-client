export function formatMoney(value: string | number) {
    const n = typeof value === "string" ? Number(value) : value;
    return n.toFixed(2);
  }
  