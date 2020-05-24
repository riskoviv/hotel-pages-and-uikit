export default function getCurrentDate() {
  const date = new Date()
  return date.toLocaleDateString()
}