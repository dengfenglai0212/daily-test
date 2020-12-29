function getLeadingActor(movie={}) {
    return movie?.actors?.[0]?.name ?? 'Unknown actor';
}

let test = {
    actors: [{name:'??'}]
}

console.log(getLeadingActor())