export default async function fetcher(url: stringz) {
   return fetch(url).then((res) => res.json());
}
