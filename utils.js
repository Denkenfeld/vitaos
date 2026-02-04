function formatDate(date, withMonth = false) {
  const opts = withMonth ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } 
                         : { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('de-DE', opts);
}

function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString('de-DE');
}

function formatTime(timeString) {
  return timeString.substring(0, 5);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    if (!result[group]) result[group] = [];
    result[group].push(item);
    return result;
  }, {});
}