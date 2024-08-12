const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { DateTime } = require('luxon');
const colors = require('colors');

function log(msg, type = 'info') {
    const colorMap = {
        info: 'green',
        success: 'cyan',
        warning: 'yellow',
        error: 'red',
        default: 'white'
    };
    const color = colorMap[type] || colorMap.default;
    console.log(`[*] ${msg}`[color]);
}

const login = async (queryId, proxy)=>{
    const url = 'https://mini.playvaliants.com/';
    const headers = {
        'accept': 'text/x-component',
        'accept-language': 'en-US,en;q=0.5',
        'content-type': 'text/plain;charset=UTF-8',
        'cookie': 'cf_clearance=hA61JlFNK8J8WrPVZA4TiZrMrNnHM44BT2H.WWJGqaY-1723426744-1.0.1.1-1efviorgL8NiOkbvu_v66j2nxI_QgErUX_DBN_SzWJNNwduRmZ9tP55TfM3C3COOZbt_.7oNqLSA2nH9OQ_GLw',
        'next-action': '2fbeb4bb5a3ddd037336b105769d121585a4bfbf',
        'next-router-state-tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2F%23tgWebAppData%3Dquery_id%253DAAH4aZUmAwAAAPhplSYYLvNq%2526user%253D%25257B%252522id%252522%25253A7089777144%25252C%252522first_name%252522%25253A%252522Kristy%252520Modafferi%252522%25252C%252522last_name%252522%25253A%252522%252522%25252C%252522language_code%252522%25253A%252522en%252522%25252C%252522allows_write_to_pm%252522%25253Atrue%25257D%2526auth_date%253D1723426742%2526hash%253Def8ee7705083f1d0bfb1ffcd6415b4f32a0db56f520b9337c7947f86050ead4b%26tgWebAppVersion%3D7.6%26tgWebAppPlatform%3Dandroid%26tgWebAppThemeParams%3D%257B%2522bg_color%2522%253A%2522%2523212121%2522%252C%2522button_color%2522%253A%2522%25238774e1%2522%252C%2522button_text_color%2522%253A%2522%2523ffffff%2522%252C%2522hint_color%2522%253A%2522%2523aaaaaa%2522%252C%2522link_color%2522%253A%2522%25238774e1%2522%252C%2522secondary_bg_color%2522%253A%2522%2523181818%2522%252C%2522text_color%2522%253A%2522%2523ffffff%2522%252C%2522header_bg_color%2522%253A%2522%2523212121%2522%252C%2522accent_text_color%2522%253A%2522%25238774e1%2522%252C%2522section_bg_color%2522%253A%2522%2523212121%2522%252C%2522section_header_text_color%2522%253A%2522%25238774e1%2522%252C%2522subtitle_text_color%2522%253A%2522%2523aaaaaa%2522%252C%2522destructive_text_color%2522%253A%2522%2523ff595a%2522%257D%22%2C%22refresh%22%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
        'origin': 'https://mini.playvaliants.com',
        'priority': 'u=1, i',
        'referer': 'https://mini.playvaliants.com/',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Brave";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36'
    };
    const data = `["${queryId}"]`;

    try{
        const agent = new HttpsProxyAgent(proxy);
        const response = await axios.post(url, data, { headers, httpsAgent: agent  })
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
            const match = setCookieHeader[0].match(/token=([^;]+)/);
            if (match && match[1]) {
                const token = match[1];
                return token;
            }
        }
    } catch (e) {
        log(`Lỗi rồi: ${e.message}`.red);
    }
    return ''
}

class ValiantAPI {
    constructor(token, proxy) {
        this.token = token;
        this.proxy = proxy;
        this.headers = {
            'Content-Type': 'text/x-component',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36',
            'Accept': 'text/x-component',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Origin': 'https://mini.playvaliants.com',
            'Referer': 'https://mini.playvaliants.com/',
            'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'cookie': 'token='+ this.token,
            'Next-Action': '2a0717c329f249700fe8e3898400c305762181ee'
        };
    }

    async getData() {
        const url = 'https://mini.playvaliants.com/';
        const payload = [
            "/user/data"
        ];

        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async claimDailyReward() {
        const url = 'https://mini.playvaliants.com/';
        const payload = [
            "/rewards/claim",
            {}
        ];

        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async taptap(payload) {
        const url = 'https://mini.playvaliants.com/';
        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async getMission() {
        const url = 'https://mini.playvaliants.com/';
        const payload = [
            "/user/missions"
        ];
        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async claimMission(payload) {
        const url = 'https://mini.playvaliants.com/';
        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async upgradeEnergy() {
        const url = 'https://mini.playvaliants.com/earn/';
        const payload = [
            "/perks/energy-level-up",
            {}
        ];

        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async upgradeMultitap() {
        const url = 'https://mini.playvaliants.com/earn/';
        const payload = [
            "/perks/click-level-up",
            {}
        ];

        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async http(url, method = 'get', data = {}) {
        try {
            const agent = new HttpsProxyAgent(this.proxy);
            const response = await axios({ url, method, headers: this.headers, data, httpsAgent: agent });
            return response.data;
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400 && data.message.startsWith('Not enough experience')) {
                    this.log('Balance không đủ!'.red);
                } else {
                    this.log(`Lỗi rồi: ${status} ${error.response.statusText}`.red);
                }
            } else {
                this.log(`Lỗi rồi: ${error.message}`.red);
            }
            return null;
        }
    }

    log(msg, type = 'info') {
        const colorMap = {
            info: 'green',
            success: 'cyan',
            warning: 'yellow',
            error: 'red',
            default: 'white'
        };
        const color = colorMap[type] || colorMap.default;
        console.log(`[*] ${msg}`[color]);
    }

    async getConfig() {
        const url = 'https://mini.playvaliants.com/';
        const payload = [
            "/gameplay/config"
        ];
        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async unlock(payload) {
        const url = 'https://mini.playvaliants.com/team/';
        const rawData = await this.http(url, 'POST', payload);
        if (rawData) {
            const jsonString = rawData.substring(rawData.indexOf('{'), rawData.lastIndexOf('}') + 1);

            try {
                const jsonData = JSON.parse(jsonString);
                return jsonData;
            } catch (error) {
                this.log('Invalid JSON string: ' + error, 'error');
                return null;
            }
        } else {
            return null;
        }
    }

    async checkProxyIP() {
        let attempts = 0;
        const maxAttempts = 1;
        while (attempts < maxAttempts) {
            try {
                const proxyAgent = new HttpsProxyAgent(this.proxy);
                const response = await axios.get('https://api.ipify.org?format=json', {
                    httpsAgent: proxyAgent
                });
                if (response.status === 200) {
                    return response.data.ip;
                } else {
                    this.log(`Không thể kiểm tra IP của proxy. Status code: ${response.status}`, 'warning');
                }
            } catch (error) {
                attempts++;
                this.log(`Error khi kiểm tra IP của proxy (Lần thử ${attempts}/${maxAttempts}): ${error.message}`.red);
                if (attempts < maxAttempts) {
                    await this.sleep(2000);
                } else {
                    this.log(`Error khi kiểm tra IP của proxy sau ${maxAttempts} lần thử: ${error.message}`, 'error');
                    break;
                }
            }
        }
    }

}

async function waitWithCountdown(delay) {
    for (let i = delay; i >= 0; i--) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`===== Đã hoàn thành tất cả tài khoản, chờ ${i} giây để tiếp tục vòng lặp =====`);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('');
}

const loadCredentials = () => {
    try {
        const data = fs.readFileSync('query.txt', 'utf-8');
        return data.split('\n').map(line => line.trim());
    } catch (err) {
        console.error("File token.txt not found or an error occurred:".red, err);
        return [];
    }
};

const loadProxies = () => {
    try {
        const data = fs.readFileSync('proxy.txt', 'utf-8');
        return data.split('\n').map(line => line.trim());
    } catch (err) {
        console.error("File proxy.txt not found or an error occurred:".red, err);
        return [];
    }
};

const main = async () => {
    const tokens = loadCredentials();
    const proxies = loadProxies();


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const mission = 'y';
    const upteam = 'n';
    const autoUpdate = 'n';

    let maxLevel = 0;
    if (autoUpdate === 'y') {
        maxLevel = await new Promise(resolve => rl.question("Lv tối đa muốn nâng cấp: ", resolve));
        maxLevel = parseInt(maxLevel, 10);
    }
    rl.close();

    while (true) {
        for (const [index, queryId] of tokens.entries()) {
            const proxy = proxies[index % proxies.length];
            const token = await login(queryId, proxy);
            if(!token) {
                console.log(`\n========== Tài khoản ${index + 1} | IP: ${proxyIP} khong tim thay token ==========`.red);
                continue
            }
            const api = new ValiantAPI(token, proxy);
            const rawData = await api.getData();
            const proxyIP = await api.checkProxyIP();
            console.log(`\n========== Tài khoản ${index + 1} | IP: ${proxyIP} ==========`.blue);

            if (rawData && rawData.data) {
                let { energy, energy_cap, experience, experience_per_hour, daily_reward, energy_level, click_level } = rawData.data;

                api.log(`Balance: ${experience}`, 'info');
                api.log(`Exp per Hour: ${experience_per_hour}/Hour`, 'info');
                api.log(`Năng Lượng: ${energy}/${energy_cap}`, 'info');

                if (!daily_reward.claimed) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const dailyData = await api.claimDailyReward();
                    if (dailyData && dailyData.data) {
                        const day = dailyData.data.day;
                        const reward = dailyData.data.reward;
                        api.log(`Đã điểm danh thành công ngày ${day} | Phần thưởng: ${reward}`, 'success');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } else {
                        api.log('Không thể lấy dữ liệu điểm danh!', 'error');
                    }
                } else {
                    api.log('Hôm nay bạn đã điểm danh rồi!'.yellow, 'warning');
                }

                if (upteam === 'y') {
                    const configData = await api.getConfig();
                    if (configData && configData.data && configData.data.unlocks) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        for (const id of Object.keys(configData.data.unlocks)) {
                            const payload = [
                                "/unlock",
                                { id: parseInt(id, 10) }
                            ];
                            const unlockData = await api.unlock(payload);
                            if (unlockData) {
                                api.log(`Mở thẻ id ${id} thành công`, 'success');
                            } else {
                                api.log(`Mở thẻ id ${id} thất bại`, 'error');
                            }
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        }
                    }
                }
                const layData = await api.getData();
                let { combo } = layData.data;
                if (combo.combo_completed && !combo.claimed) {
                    const comboPayload = [
                        "/combo/claim",
                        {}
                    ];
                    const comboData = await api.taptap(comboPayload);
                    if (comboData && comboData.data) {
                        api.log(`Combo đã được hoàn thành..nhận 5M!`, 'warning');
                    } else {
                        api.log('Không thể nhận phần thưởng combo!', 'error');
                    }
                }

                if (autoUpdate === 'y') {
                    if (energy_level < maxLevel) {
                        api.log("Nâng cấp năng lượng tối đa...");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const upgradeData = await api.upgradeEnergy();
                        if (upgradeData.error) {
                            if (upgradeData.error === 'Not enough experience') {
                                api.log(`Balance không đủ để nâng cấp năng lượng!`, 'error');
                            } else {
                                api.log(`Balance không đủ để nâng cấp năng lượng!`, 'error');
                            }
                        } else if (upgradeData.data && upgradeData.data.energy_level) {
                            api.log(`Năng lượng được nâng cấp lên lv ${upgradeData.data.energy_level}`, 'success');
                        } else {
                            api.log(`Trạng thái không xác định`, 'warning');
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    if (click_level < maxLevel) {
                        api.log("Nâng cấp multitap...");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const upgradeData = await api.upgradeMultitap();
                        if (upgradeData.error) {
                            if (upgradeData.error === 'Not enough experience') {
                                api.log(`Balance không đủ để nâng cấp multitap!`, 'error');
                            } else {
                                api.log(`Balance không đủ để nâng cấp multitap!`, 'error');
                            }
                        } else if (upgradeData.data && upgradeData.data.click_level) {
                            api.log(`Multi được nâng cấp thành công lên lv ${upgradeData.data.click_level}`, 'success');
                        } else {
                            api.log(`Trạng thái không xác định`, 'warning');
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }

                if (mission === 'y') {
                    const missionData = await api.getMission();
                    if (missionData && missionData.data && missionData.data.missions) {
                        for (const mission of missionData.data.missions) {
                            if (mission.type === 'referral') continue;
                            if (!mission.claimed) {
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                const payload = [
                                    "/missions/claim",
                                    { id: mission.id }
                                ];
                                const claimData = await api.claimMission(payload);
                                if (claimData) {
                                    api.log(`Làm nhiệm vụ ${mission.id} thành công | Phần thưởng: ${claimData.data.reward}`, 'success');
                                }
                            }
                        }
                    }
                }

                while (true) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const tap = Math.min(randomInt(50, 60), energy);
                    const payload = [
                        "/gameplay/click",
                        { count: tap }
                    ];
                    const tapData = await api.taptap(payload);

                    if (tapData && tapData.data) {
                        const newEnergy = tapData.data.user_energy;
                        const reward = tapData.data.reward;

                        api.log(`Tap được ${reward} lần, Năng lượng còn: ${newEnergy}`, 'success');

                        energy = newEnergy;
                    } else {
                        api.log('Không thể lấy dữ liệu!'.red, 'error');
                        break;
                    }

                    if (energy < 50) {
                        api.log('Năng lượng dưới 50, dừng tap cho tài khoản này.', 'warning');
                        break;
                    }
                }
            } else {
                console.log('Dữ liệu trả về không hợp lệ hoặc không có dữ liệu người dùng.');
            }
        }
        const delay = randomInt(300, 500);
        await waitWithCountdown(delay);
    }
};

const randomInt = (min, max) => Math.floor(Math.random() * (min + (max - min + 1)));

main().catch(err => console.error(err.red));