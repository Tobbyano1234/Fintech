import { promises as fsPromises } from 'fs';


const readFileData = async (filename: string): Promise<string[]> => {
    try {
        const contents = await fsPromises.readFile(filename, 'utf-8');
        const fileDataArr = contents.split(/\r?\n/);
        return fileDataArr;
    } catch (err) {
        console.error(err);
        return [];
    }
}

const getCustomerData = async () => {
    const result = await readFileData("./customers.txt");
    return result;
}

const extractVals = (str: string) => {
    let id = "";
    let lat = "";
    let long = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] == "i" && str[i + 1] == "d") {
            ("id");
            id = trimBegWhiteSpace(copyTillSpecialCharacter(str.slice(i + 3)));
        } else if (str[i] == "l" && str[i + 2] == "t") {
            ("lat");
            lat = trimBegWhiteSpace(copyTillSpecialCharacter(str.slice(i + 4)));
        } else if (str[i] == "l" && str[i + 3] == "g") {
            ("long");
            long = trimBegWhiteSpace(copyTillSpecialCharacter(str.slice(i + 5)));
        }
    }
    return { id, lat, long };
};

const copyTillSpecialCharacter = (str: string): string => {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ",") break;
        res += str[i];
    }
    return res;
};

const trimBegWhiteSpace = (str: string): string => {
    if (str[0] !== " ") {
        return str;
    }
    return trimBegWhiteSpace(copyTillSpecialCharacter(str.slice(1)));
};

const sortFunc = (a: { id: string }, b: { id: string }) => {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

export const getCustomersWithin100km = async () => {
    let invitee = [] as { id: string, lat: string, long: string }[];
    const customerData = await getCustomerData();
    customerData.forEach((customer: string) => {
        const result = extractVals(customer);
        if (result.id.length !== 36) {
            console.error(`Invalid ID ${result.id}`)
            return;
        }
        // The coordinates of FINTECH CO. are: 52.493256, 13.446082, so using the values as distant A.
        const distance = getDistanceFromLatLongInKm(52.493256, 13.446082, Number(result.lat), Number(result.long));
        if (distance <= 100) {
            invitee.push(result);
        }
    })
    const sortedInvitee = invitee.sort(sortFunc);
    return sortedInvitee;
};

const getDistanceFromLatLongInKm = (lat1 = 52.493256, long1 = 13.446082, lat2: number, long2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(long2 - long1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.trunc(distance);
}

const deg2rad = (deg: number) => {
    const output = deg * (Math.PI / 180);
    return output;
}
