import { model } from "mongoose";

const Album = model('Album', {
    title: String,
});

export default Album;