export const fetchData = async () => {
    try {
    const response = await fetch('https://raw.githubusercontent.com/Gaboamador/payday2-data/main/tags.json');
    const tagsRawOnline = await response.json();
    return { tagsRawOnline };
} catch (error) {
    console.error('Error fetching data:', error);
    throw error;
}
};