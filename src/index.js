import fs from "fs"
import AdmZip from "adm-zip"

export default function (directory, output) {
    if (!directory.endsWith("/")) {
        directory += "/"
    }
    if (fs.readdirSync(output).length === 0) {
        fs.mkdirSync(output)
    }
    // Create a new zip file
    const zip = new AdmZip();

    // Get the contents of the directory
    const files = fs.readdirSync(directory);

    // Add the files to the zip
    for (const file of files) {
        const fileLink = directory + file
        // If the file is a directory, add its contents recursively
        if (fs.statSync(fileLink).isDirectory()) {
            addDirectoryRecursively(zip, fileLink);
        } else {
            // Otherwise, add the file to the zip
            zip.addFile(fileLink, fs.readFileSync(fileLink));
        }
    }

    // Function to add a directory recursively to a zip file
    function addDirectoryRecursively(zip, directory) {
        // Get the contents of the directory
        const files = fs.readdirSync(directory);

        // Add the files to the zip
        for (const file of files) {
            // If the file is a directory, add its contents recursively
            if (fs.statSync(`${directory}/${file}`).isDirectory()) {
                addDirectoryRecursively(zip, `${directory}/${file}`);
            } else {
                // Otherwise, add the file to the zip
                zip.addFile(`${directory}/${file}`, fs.readFileSync(`${directory}/${file}`));
            }
        }
    }

    // Write the zip file
    zip.writeZip(output)
}