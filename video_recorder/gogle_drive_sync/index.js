const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const KETFILEPATH = "clever-house-318609-7564dd80d870.json"
const SCOPES = ['https://www.googleapis.com/auth/drive'];

let video_dir_id = "1d-T0egsTMKYEoOe_WDxIMR9F0jf7aAHm"
let img_dir_id = "1cy8nUc-cOGUpOIFVa9z1j6c2nAtJ_UOo"
let saved_files_path = "./backup.json"

let video_path = "/home/pi/Videos/"
let photos_path = ""

let max_videos_num = 630

const auth = new google.auth.GoogleAuth({
    keyFile: KETFILEPATH,
    scopes: SCOPES
})
console.log("start uploading")

let createAndUploadFile = async (auth, file_name, mimeType, folder_id) => {
    const driveService = google.drive({ version: 'v3', auth })

    let fileMetaData = {
        'name': file_name.slice(file_name.lastIndexOf("/") + 1),
        'parents': [folder_id]
    }
    let media = {
        mimeType: mimeType,
        body: fs.createReadStream(file_name)
    }
    let res = await driveService.files.create({
        resource: fileMetaData,
        media: media,
    })
    if (res.status === 200) {
        console.log('Created file id: ', res.data.id)
        return res.data.id
    } else {
        console.log("Error creating file")
        return 0
    }
    // let a = await driveService.files.list()
    // console.log(a.data.files)
}

let deleteFile = async (auth, file_id) => {
    const driveService = google.drive({ version: 'v3', auth })
    let res = await driveService.files.delete({ 'fileId': file_id })
    if (res.status === 200) {
        console.log('Created file id: ', res.data.id)
    } else {
        console.log("Error creating file")
    }
    let a = await driveService.files.list()
    console.log(a.data.files)
}

let get_sorted_files_list = (path, areVideos) => {
    let files = fs.readdirSync(path);
    if (areVideos) {
        files.sort(function (a, b) {
            a = new Date(a.replace("_", " ").slice(0, a.indexOf(".")))
            b = new Date(b.replace("_", " ").slice(0, b.indexOf(".")))
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        });
    } else {
        files.sort(function (a, b) {
            a = parseInt(a.slice(0, a.indexOf(".")))
            b = parseInt(b.slice(0, b.indexOf(".")))
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        });
    }
    return files
}

let get_saved_files = (path) => {
    try {
        let file = require(path);
        return file
    } catch (e) {
        console.log("error in get_saved_files ", e)
        let data = { 'google_drive_vids': [], 'google_drive_deleted': [], 'google_drive_files_ids': {} };
        fs.writeFileSync(path, JSON.stringify(data));
        return data;
    }
}

let add_saved_files = (path, name, id) => {
    let data = get_saved_files(path)
    data['google_drive_vids'].push(name)
    data['google_drive_files_ids'][name] = id
    fs.writeFileSync(path, JSON.stringify(data));
}

let add_removed_files = (path, name) => {
    let data = get_saved_files(path);
    data = data['google_drive_deleted'].push(name);
    data = data['google_drive_vids'].splice(data['google_drive_vids'].indexOf(name), 1);
    fs.writeFileSync(path, JSON.stringify(data));
}

// console.log(get_sorted_files_list(video_path, 1))


let run = async () => {
    let files = get_sorted_files_list(video_path, 1);
    let saved_files = get_saved_files(saved_files_path);
    for (let i = 0; i < files.length - 1; i++) {
        let file = files[i];
        console.log(saved_files["google_drive_vids"].includes(file))
        if (!saved_files["google_drive_vids"].includes(file) && !saved_files["google_drive_deleted"].includes(file)) {
            let id = await createAndUploadFile(auth, video_path + file, 'video/mkv', video_dir_id).catch(err => console.error(err))
            if (id !== 0) {
                add_saved_files(saved_files_path, file, id)
            }
        }

        while (saved_files["google_drive_vids"].length > max_videos_num) {
            deleteFile(auth, saved_files["google_drive_files_ids"][files[0]]).catch(err => console.error(err))
            add_removed_files(saved_files_path, file)
            saved_files = get_saved_files(saved_files_path);
        }
    }
}

setInterval(() => {
    run()
}, 5 * 60 * 1000)

run()
// setInterval(()=> {

// }, 250)

// createAndUploadFile(auth, "/home/mkulik05/2021-06-29 20-18-13.mkv", 'video/mkv', video_dir_id).catch(err => console.error(err))
