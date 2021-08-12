let all = {};
const allWin = [document.getElementById("backpack"), document.getElementById("levelUP"), document.getElementById("addExp")];
Object.defineProperty(all, "length", {
    writable: true,
    configurable: false,
    value: 0,
});

const artifactList = (artifactListBox, a) => {
    a.length = 0;
    for (const aKey in a) {
        a.length = 1 + a.length;
    }
    artifactListBox.innerHTML = "";
    for (const i in a) {
        const artifact = a[i];
        let artifactBox = document.createElement("div");
        let artifactLevelBox = document.createElement("div");
        let artifactQualityBox = document.createElement("div");
        let artifactImg = document.createElement("img");
        let artifactImgBox = document.createElement("div");

        artifactImg.src = artifact.imgURL;
        artifactImg.ondragstart = (e) => {
            e.preventDefault();
        };
        artifactImgBox.append(artifactImg);
        artifactImgBox.classList.add("artifactImg");

        artifactLevelBox.innerHTML = "+" + artifact.level;
        artifactLevelBox.classList.add("artifactLevel");

        for (let j = 0; j < artifact.quality; j++) {
            const star = document.createElement("div");
            star.classList.add("star");
            artifactQualityBox.append(star);
        }

        artifactQualityBox.classList.add("artifactQuality");
        artifactLevelBox.append(artifactQualityBox);

        artifactBox.classList.add("artifact");
        switch (artifact.quality) {
            case 5:
                artifactBox.classList.add("five");
                break;
            case 4:
                artifactBox.classList.add("four");
                break;
            case 3:
                artifactBox.classList.add("three");
                break;
            case 2:
                artifactBox.classList.add("two");
                break;
            case 1:
                artifactBox.classList.add("one");
                break;
        }
        if (artifactListBox === document.getElementById("artifactList")) {
            artifactBox.onclick = () => {
                document.querySelector("#levelupButton>button").onclick = () => {
                    levelUpView(artifact.id);
                    winOnTop(1);
                };
                artifactView(artifact.id);
            };
        } else artifactBox.onclick = () => artifactView(artifact.id);

        artifactBox.append(artifactImgBox);
        artifactBox.append(artifactLevelBox);

        artifactListBox.append(artifactBox);
    }
};

const artifactView = (id) => {
    const artifact = all[id];
    document.querySelector("#backpackArtifactView>.artifactName").innerHTML = artifact.name;
    document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactImgView").src = artifact.imgURL;
    document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactImgView").alt = artifact.name;
    document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactPiece").innerHTML = artifact.piecese;
    document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactStatRoilName").innerHTML = artifact.statRoil.main.statRoil;
    if (artifact.statRoil.main.value > 1) {
        document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactStatRoilValue").innerHTML = artifact.statRoil.main.value;
    } else document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactStatRoilValue").innerHTML = (artifact.statRoil.main.value * 100).toFixed(1) + "%";

    document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactStatRoilQuality").innerHTML = "";
    for (let i = 0; i < artifact.quality; i++) {
        let star = document.createElement("div");
        star.classList.add("star");
        document.querySelector("#backpackArtifactView>.artifactStatRoil>.artifactStatRoilQuality").append(star);
    }

    document.querySelector("#backpackArtifactView>.artifactInfo>.artifactLevel").innerHTML = "+" + artifact.level;

    document.querySelector("#backpackArtifactView>.artifactInfo>.artifactSubStatRoil>ul").innerHTML = "";
    for (let i = 0; i < artifact.statRoil.sub.length; i++) {
        let li = document.createElement("li");
        if (artifact.statRoil.sub[i].value > 1) {
            li.innerHTML = artifact.statRoil.sub[i].statRoil + " +" + artifact.statRoil.sub[i].value;
        } else li.innerHTML = artifact.statRoil.sub[i].statRoil + " +" + (artifact.statRoil.sub[i].value * 100).toFixed(1) + "%";
        document.querySelector("#backpackArtifactView>.artifactInfo>.artifactSubStatRoil>ul").append(li);
    }

    document.querySelector("#backpackArtifactView>.artifactInfo>.artifactSetName").innerHTML = artifact.set + "：";
    document.querySelector("#backpackArtifactView>.artifactInfo>.artifactPiece>.twoPiece").innerHTML = "两件套：" + artifact.info.twoPiece;
    document.querySelector("#backpackArtifactView>.artifactInfo>.artifactPiece>.fourPiece").innerHTML = "四件套：" + artifact.info.fourPiece;

    switch (artifact.quality) {
        case 5:
            document.querySelector("#backpackArtifactView>.artifactStatRoil").style.backgroundColor = "#a67650";
            break;
        case 4:
            document.querySelector("#backpackArtifactView>.artifactStatRoil").style.backgroundColor = "rgb(125,106,174)";
            break;
    }
};

const newArtifact = (Set, Quality, Pieces) => {
    const id = new Date().getTime() + "" + Math.random().toFixed(5).replace(".", "");
    let artifact = {};

    artifact.id = id;
    Object.defineProperty(artifact, "info", {
        value: setInfo[Set],
        writable: false,
        configurable: false,
    });
    artifact.level = 0;
    artifact.exp = 0;

    if (
        sets.some((v) => {
            return v === Set; //套装
        })
    ) {
        artifact.set = Set;
        if (Quality >= setInfo[Set].minQuality && Quality <= setInfo[Set].maxQuality) {
            //品质
            artifact.quality = Quality;
        } else if (Quality === undefined || Quality === 0) {
            Quality = artifact.info.minQuality + Math.round(Math.random() * (artifact.info.maxQuality - artifact.info.minQuality));
            artifact.quality = Quality;
        } else {
            console.error(`Quality 必须是 ${setInfo[Set].minQuality}-${setInfo[Set].maxQuality} 之间,或者是 0 （随机）`);
            return;
        }
        if (
            pieces.some((v) => {
                return v === Pieces;
            })
        ) {
            artifact.piecese = Pieces; //部位
        } else if (Pieces === "" || Pieces === undefined) {
            Pieces = pieces[Math.floor(Math.random() * pieces.length)];
            artifact.piecese = Pieces;
        } else console.error(`Pieces 必须是 ${pieces.toString()} 之一`);
    } else {
        console.error(`Set 必须是 ${sets.toString()} 之一`);
        return;
    }

    artifact.statRoil = {};

    if (artifact.piecese !== "生之花" && artifact.piecese !== "死之羽") {
        artifact.statRoil.main = JSON.parse(statRoil()).main[artifact.piecese][Math.floor(Math.random() * JSON.parse(statRoil()).main[artifact.piecese].length)];
    } else artifact.statRoil.main = JSON.parse(statRoil()).main[artifact.piecese];
    //=-=-=-=-=-=-=-=-
    artifact.statRoil.sub = [];
    let subStatRoil = JSON.parse(statRoil()).sub;

    subStatRoil.splice(
        subStatRoil.findIndex((v, i) => {
            if (v.class === artifact.statRoil.main.class) return i;
        }),
        1
    );

    let newSubStatRoil = () => {
        //副词条
        let ran = Math.floor(Math.random() * subStatRoil.length);
        let roil = JSON.stringify(subStatRoil[ran]);
        let mainStatRoil = artifact.statRoil.main;
        if (roil.class === mainStatRoil) {
            newSubStatRoil();
        } else {
            subStatRoil.splice(ran, 1);
            return JSON.parse(roil);
        }
    };
    let minSubStatRoil;
    switch (artifact.quality) {
        case 5:
            minSubStatRoil = 3;
            break;
        case 4:
            minSubStatRoil = 2;
            break;
    }
    for (let i = 0; i < minSubStatRoil + Math.round(Math.random()); i++) {
        //处理并添加副词条
        let roil = newSubStatRoil();

        subStatRoil.splice(
            subStatRoil.findIndex((v, i) => {
                if (v === roil) return i;
            }),
            1
        );

        roil.value = roil.value[Math.floor(roil.value.length * Math.random())];
        roil.level = 0;

        artifact.statRoil.sub.push(roil);
    }

    if (artifact.statRoil.sub.length < 4 && artifact.quality > 1) artifact.statRoil.sub.other = subStatRoil;

    switch (artifact.piecese) {
        case "生之花":
            artifact.pieceEn = "flower";
            break;
        case "死之羽":
            artifact.pieceEn = "plume";
            break;
        case "时之沙":
            artifact.pieceEn = "sands";
            break;
        case "空之杯":
            artifact.pieceEn = "goblet";
            break;
        case "理之冠":
            artifact.pieceEn = "circlet";
            break;
    }
    artifact.imgURL = artifact.info.piecesInfo[artifact.pieceEn].imgURL;
    artifact.name = artifact.info.piecesInfo[artifact.pieceEn].name;
    all[id] = artifact;

    artifactList(document.getElementById("artifactList"), all);
};
for (let i = 0; i < 50; i++) newArtifact("悠古的磐岩", 0);

const levelUpView = (id) => {
    const art = all[id];

    document.querySelector("#addExp>button").onclick = () => {
        levelup(id, document.getElementById("EXPInput").value * 1);
        winOnTop(1);
    };

    document.getElementById("artifactNameAndPieces").innerHTML = `${art.piecese} / ${art.name}`;
    document.querySelector("#levelUPArtifactImg>img").src = art.imgURL;
    document.querySelector("#levelUPArtifactImg>img").alt = art.name;
    document.getElementById("level").innerHTML = `+${art.level}`;

    let p = levelExp(art.level, art.quality);
    let n = levelExp(art.level + 1, art.quality);

    document.getElementById("EXP").innerHTML = `${art.exp}/${n}`;
    document.querySelector("#artifactExpBar>div").style.width = ((art.exp - p) / (n - p)) * 100 + "%";

    document.querySelector("#artifactStatRoil>ul").innerHTML = "";
    for (let i = 0; i < art.statRoil.sub.length + 1; i++) {
        let v = document.createElement("span");
        let s = document.createElement("li");
        if (i === 0) {
            v.innerHTML = art.statRoil.main.value;
            s.innerHTML = art.statRoil.main.statRoil;
        } else {
            v.innerHTML = art.statRoil.sub[i - 1].value;
            s.innerHTML = art.statRoil.sub[i - 1].statRoil;
        }
        if (v.innerHTML * 1 < 1) v.innerHTML = (v.innerHTML * 100).toFixed(1) + "%";
        s.append(v);
        document.querySelector("#artifactStatRoil>ul").append(s);
    }

    document.getElementById("needCoin").innerHTML = '<img style="height: inherit" src="img/mora.png">0';
};
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
let e = [];
const addExp = (exp) => {
    let newExp = {
        class: "EXP",
        EXP: exp,
    };
    e.push(newExp);
    for (let i = 0; i < e.length; i++) {}
};

const levelExp = (l, q) => {
    let o = 0;
    for (let i = 0; i <= l; i++) {
        o += Exp.needExp[q - 1][i];
    }
    if (typeof o === "string") o = Exp.needExp[q - 1][l];
    return o;
};

const levelup = (id, exp) => {
    const artifact = all[id];
    if (artifact === undefined) {
        console.error(`id为 ${id} 的圣遗物不存在`);
        return;
    } else if (typeof id !== "string") {
        console.error(`id的类型必须为 String`);
        return;
    }

    if (artifact.level < 20) artifact.exp += exp;
    let level = () => {
        if (artifact.level === 20) {
            artifact.exp = levelExp(20, 5);
        } else if (artifact.exp > levelExp(artifact.level + 1, artifact.quality)) {
            artifact.level++;
            artifact.statRoil.main.value = JSON.parse(statRoil()).main.value[artifact.statRoil.main.class][artifact.level];
            if (artifact.level % 4 === 0) {
                const subRoil = artifact.statRoil.sub[Math.floor(Math.random() * artifact.statRoil.sub.length)];
                const roilValue = JSON.parse(statRoil()).sub[
                    JSON.parse(statRoil()).sub.findIndex((v, i) => {
                        if (v.class === subRoil.class) return i;
                    })
                ];
                subRoil.value = subRoil.value + roilValue.value[subRoil.level];
                subRoil.level++;
            }
            level();
        }
    };
    level();
    levelUpView(id);
    console.log(artifact);
};

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const winOnTop = (index) => {
    for (let i = 0; i < allWin.length; i++) {
        allWin[i].style.zIndex = -1;
        allWin[i].style.opacity = 0;
    }

    allWin[index].style.opacity = 1;
    allWin[index].style.zIndex = 5;
};

const mainBox = document.getElementById("main");
const artifactListBox = document.getElementById("artifactList");
const backpackArtifactViewBox = document.getElementById("backpackArtifactView");
const levelupButtonBox = document.getElementById("levelupButton");
const levelupBox = document.getElementById("levelUP");
let resize = () => {
    mainBox.style.height = 1080 + "px";
    mainBox.style.width = 1920 + "px";
    mainBox.style.transform = `scale(${window.innerHeight / 1080},${window.innerHeight / 1080})`;

    artifactListBox.style.width = 1920 * 0.6 + "px";
    artifactListBox.style.height = 1080 - 1920 * 0.04 + "px";
    backpackArtifactViewBox.style.height = 1080 - 1920 * 0.1 + "px";

    artifactListBox.style.margin = 1920 * 0.02 + "px";

    levelupButtonBox.style.width = 1920 * 0.3 + "px";
    levelupButtonBox.style.marginRight = 1920 * 0.04 + "px";
    levelupButtonBox.style.marginBottom = 1920 * 0.02 + "px";
    levelupButtonBox.style.height = 100 + "px";

    backpackArtifactViewBox.style.width = 1920 * 0.3 + "px";
    backpackArtifactViewBox.style.margin = 1920 * 0.02 + "px";

    levelupBox.style.height = 1080 + "px";
    levelupBox.style.width = 1920 + "px";
};

resize();

window.onresize = resize;

function full() {
    if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
    } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
    } else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
    }
    document.getElementById("fullscreen").onclick = "exitFullscreen()";
}

function exitFullscreen() {
    if (document.body.exitFullScreen) {
        document.body.exitFullScreen();
    } else if (document.body.mozCancelFullScreen) {
        document.body.mozCancelFullScreen();
    } else if (document.body.webkitExitFullscreen) {
        document.body.webkitExitFullscreen();
    } else if (document.body.msExitFullscreen) {
        document.body.msExitFullscreen();
    }
    document.getElementById("fullscreen").onclick = "full()";
}

document.getElementById("artifactAutoAdd").onclick = () => {
    let art;
    art = (() => {
        let o = [];
        for (const allKey in all) {
            let j = JSON.stringify(all[allKey]);

            o.push(JSON.parse(j));
        }
        return o;
    })();

    artifactList(document.getElementById("LevelUpList"), art.splice(0, 10));
};

document.querySelectorAll("img").forEach((ele) => {
    ele.ondragstart = (e) => e.preventDefault();
});

document.getElementById("levelUPExitButton").onclick = () => {
    winOnTop(0);
    artifactList(document.getElementById("artifactList"), all);
};
