// Returns the next valid business day (skips Sat/Sun) at 10:00 AM local time.
export function getNextBusinessDay(from = new Date()) {
    const date = new Date(from);
    date.setDate(date.getDate() + 1);

    // Skip Saturday(6) and Sunday(0) — Ground pickup isn't guaranteed those days
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }

    date.setHours(10, 0, 0, 0);
    return date;
}

// Formats a Date as "YYYY-MM-DD" using LOCAL date parts — never UTC —
// so every FedEx call (ship, pickup, anything else) agrees on the same
// calendar day regardless of server timezone. This is the ONLY place
// a Date becomes a FedEx date string — use this everywhere, never
// toISOString().split("T")[0] directly.
export function toFedExDateOnly(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    return `${yyyy}-${MM}-${dd}`;
}

// Formats a Date as "YYYY-MM-DDTHH:mm:ssZ" — required for readyDateTimestamp
// per FedEx Pickup API docs example: "2019-02-07T10:00:00Z".
// Uses local wall-clock time (10 AM as set by getNextBusinessDay) with literal "Z".
export function toFedExReadyTimestamp(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}Z`;
}