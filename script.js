var client_id = '';
var client_secret = '';

async function fetchToken () {
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const parsedRes = await res.json();
    return parsedRes.access_token;
}

async function fetchRecommendations () {
    const token = await fetchToken();
    console.log("token", token);
    // Sample recommendation request with seed parameters
    const res = await fetch('https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // optional
        }
    });
    const parsedRes = await res.json();
    console.log("RECOMMENDATIONS RESPONSE", parsedRes);
    return parsedRes;
}

async function showTracks () {
    const recommendationsResponse = await fetchRecommendations();
    const recommendations = recommendationsResponse.tracks;

    for (const track of recommendations) {
        console.log("*********")
        console.log("artists", track.artists.map(artist => artist.name).join(", "));
        console.log("track", track.name)
        console.log("duration", formatDuration(track.duration_ms));
        console.log("album", track.album.name)
        console.log("*********\n\n")
    }
}

function formatDuration(duration_ms) {
    // Convert milliseconds to seconds
    let seconds = Math.floor(duration_ms / 1000);
    
    // Calculate hours, minutes, and remaining seconds
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    
    // Format the duration as HH:MM:SS
    let formattedDuration = "";
    if (hours > 0) {
        formattedDuration += `${hours}:`;
    }
    formattedDuration += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return formattedDuration;
}

showTracks();