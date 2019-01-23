/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as GltfGen from '@microsoft/gltf-gen';
import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import {
    Actor,
    AnimationKeyframe,
    AnimationWrapMode,
    ButtonBehavior,
    Context,
    DegreesToRadians,
    LookAtMode,
    Quaternion,
    TextAnchorLocation,
    TextJustify,
    Vector3
} from '@microsoft/mixed-reality-extension-sdk';

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
    private connectedUsers: { [id: string]: MRESDK.User } = {};
    private text: Actor = null;
    private cube: Actor = null;
    private curtains: Actor = null;
    private spotLight: Actor = null;

    constructor(private context: Context, private baseUrl: string) {
        this.context.onUserJoined(user => this.userJoined(user));
        this.context.onUserLeft(user => this.userLeft(user));
        this.context.onStarted(() => this.started());
    }

    private userJoined(user: MRESDK.User) {
        console.log(`user-joined: ${user.name}, ${user.id}`);
        this.connectedUsers[user.id] = user;
        console.log(`Players Connected: ${Object.keys(this.connectedUsers).length}`);
        console.log(this.connectedUsers);
        this.addUserButton(user);
    }

    private userLeft(user: MRESDK.User) {
        console.log(`user-left: ${user.name}`);
        delete this.connectedUsers[user.id];
        console.log(`Players Connected: ${Object.keys(this.connectedUsers).length}`);
    }

    private addUserButton(user: MRESDK.User) {
        console.log(`Add User: ${user.name}`);
        const button = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: {x: .1, y: .1, z: .1}
            },
            addCollider: true,
            actor: {
                transform: {
                    position: {x: 0 + (Object.keys(this.connectedUsers).length * 0.3), y: 0, z: -10}
                }
            }
        });
        MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                transform: {
                    position: {x: 0 + (Object.keys(this.connectedUsers).length * 0.3), y: .2, z: -10}
                },
                text: {
                    contents: user.name,
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.05,
                    justify: TextJustify.Center
                }
            }
        });
        const buttonClick = button.value.setBehavior(MRESDK.ButtonBehavior);
        buttonClick.onClick('pressed', (userId: string) => {
            this.spotLight.lookAt(user, LookAtMode.TargetXY);
        });
    }

    // Try this, native resource
    // arofloatingheart

    /**
     * Once the context is "started", initialize the app.
     */
    private started = async () => {

        const url = 'https://mre-rooftop.herokuapp.com';
        console.log(`baseUrl: ${this.baseUrl}`);

        // Create a new actor with no mesh, but some text. This operation is asynchronous, so
        // it returns a "forward" promise (a special promise, as we'll see later).
        // const textPromise = Actor.CreateEmpty(this.context, {
        //     actor: {
        //         name: 'Text',
        //         transform: {
        //             position: { x: 0, y: 0.5, z: 0 }
        //         },
        //         text: {
        //             contents: "Ben's Cube",
        //             anchor: TextAnchorLocation.MiddleCenter,
        //             color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
        //             height: 0.3
        //         }
        //     }
        // });

        // Even though the actor is not yet created in Altspace (because we didn't wait for the promise),
        // we can still get a reference to it by grabbing the `value` field from the forward promise.
        // this.text = textPromise.value;

        // Here we create an animation on our text actor. Animations have three mandatory arguments:
        // a name, an array of keyframes, and an array of events.
        // this.text.createAnimation({
        //     // The name is a unique identifier for this animation. We'll pass it to "enableAnimation" later.
        //     animationName: "Spin",
        //     // Keyframes define the timeline for the animation: where the actor should be, and when.
        //     // We're calling the generateSpinKeyframes function to produce a simple 20-second revolution.
        //     keyframes: this.generateSpinKeyframes(20, Vector3.Up()),
        //     // Events are points of interest during the animation. The animating actor will emit a given
        //     // named event at the given timestamp with a given string value as an argument.
        //     events: [],

        //     // Optionally, we also repeat the animation infinitely.
        //     wrapMode: AnimationWrapMode.Loop
        // })
        //     .catch(reason => this.context.logger.log('error', `Failed to create spin animation: ${reason}`));
        const curtainPromise = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                transform: {
                    position: {x: 0, y: 2, z: -4.6},
                    scale: {x: 11, y: 1, z: 11}
                }
            }
        });
        const curtainPromise2 = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                parentId: curtainPromise.value.id,
                transform: {
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
                }
            }
        });
        this.curtains = curtainPromise2.value;

        // this.curtains.createAnimation({
        //     // The name is a unique identifier for this animation. We'll pass it to "enableAnimation" later.
        //     animationName: "Spin",
        //     // Keyframes define the timeline for the animation: where the actor should be, and when.
        //     // We're calling the generateSpinKeyframes function to produce a simple 20-second revolution.
        //     keyframes: this.generateCurtainframes(10, Vector3.Up()),
        //     // Events are points of interest during the animation. The animating actor will emit a given
        //     // named event at the given timestamp with a given string value as an argument.
        //     events: []
        // }).catch(reason => this.context.logger.log('error', `Failed to create spin animation: ${reason}`));

        // this.context.logger.log('info', 'Loading');
        // const group = this.context.assets.loadGltf('curtainPiece', `${url}/piece.gltf`)
        //     .catch(reason => this.context.logger.log('error', `Failed to create spin animation: ${reason}`))
        //     .then(() => this.context.logger.log('info', 'Done1'));
        // this.context.assets.ready().then(() => {
        //     this.context.logger.log('info', 'Done2');
        // }).catch(() => 'obligatory catch');
        // this.context.logger.log('info', 'Loaded');

        // MRESDK.Actor.CreateFromGLTF(this.context, {
        //     resourceUrl: `${url}/curtains.gltf`,
        //     actor: {
        //         transform: {
        //             position: {x: 0, y: -1, z: 4.5}
        //         }
        //     }
        // });
    // const group = await this.context.assets.loadGltf('curtain', `${url}/piece.gltf`);
        for (let i = 0; i < 20; i++) {
            const curtainPiece = MRESDK.Actor.CreateEmpty(this.context, {
                actor: {
                    parentId: this.curtains.id,
                    name: `curtain${i}`,
                    transform: {
                        rotation: Quaternion.FromEulerAngles(0, (-47.5 + (i * 5)) * DegreesToRadians, 0)
                    }
                }
            });
            MRESDK.Actor.CreateFromGLTF(this.context, {
                resourceUrl: `${url}/piece.gltf`,
                // prefabId: group.prefabs.byIndex(0).id,
                // Also apply the following generic actor properties.
                actor: {
                    parentId: curtainPiece.value.id,
                    transform: {
                        position: {x: 0, y: -1, z: -1},
                        scale: {x: 0.0875 / 2, y: 1 / 2, z: 4 / 2},
                        rotation: Quaternion.FromEulerAngles(90 * DegreesToRadians, 0, 0)
                    }
                }
            });
        }

        // for (let i = 0; i < 20; i++) {
        //     const actor = await MRESDK.Actor.CreateFromPrefab(this.context, {
        //         prefabId: group.prefabs.byIndex(0).id,
        //         actor: {
        //             transform: {
        //                 position: { x: 10 - i, y: 1, z: 0 }
        //             }
        //         }
        //     });
        // }
        // MRESDK.Actor.CreateFromGLTF(this.context, {
        //     resourceUrl: `https://bengarfield.github.io/AltVR/Enterprise-D/glb.glb`,
        //     // Also apply the following generic actor properties.
        //     actor: {
        //         transform: {
        //             position: {x: 0, y: 0, z: 10},
        //             scale: {x: .5, y: .5, z: .5}
        //         }
        //     }
        // });

        for (let i = 1; i < 19; i++) {
            this.curtains.children[i].createAnimation(
                "Open", {
                keyframes: this.generateCurtainframes(i < 10 ? 0 + (.5 * i) : 4.5 - (.5 * (i - 10)),
                    -47.5 + (5 * i), i < 10 ? -47.5 : 47.5, 0),
                events: []
            }).catch(reason => console.log(`Failed to create spin animation: ${reason}`));
            this.curtains.children[i].createAnimation(
                "Close", {
                keyframes: this.generateCurtainframes(i < 10 ? 0 + (.5 * i) : 4.5 - (.5 * (i - 10)),
                    i < 10 ? -47.5 : 47.5, -47.5 + (5 * i), i < 10 ? 4.5 - (.5 * i) : 0 + (.5 * (i - 10))),
                events: []
            }).catch(reason => console.log(`Failed to create spin animation: ${reason}`));
        }

        // <a-entity id='building1' position='-13 12 -40' scale='.5 .5 .5'></a-entity>
        const building1 = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Building1',
                transform: {
                    position: {x: -13, y: 12, z: 40},
                    scale: {x: 0.5, y: 0.5, z: 0.5}
                }
            }
        });
        const building2 = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Building2',
                transform: {
                    position: {x: 3, y: 17.5, z: 60},
                    scale: {x: 0.3, y: 0.3, z: 0.3}
                }
            }
        });
        const building3 = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Building3',
                transform: {
                    position: {x: 13, y: 15, z: 50},
                    scale: {x: 0.5, y: 0.5, z: 0.5}
                }
            }
        });
        this.addWindows(building1.value);
        this.addWindows(building2.value);
        this.addWindows(building3.value);

        // this.setWindows(building1.value, 'the');
        // this.setWindows(building2.value, 'roof');
        // this.setWindows(building3.value, 'top');

        const controlPanels = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'ControlPanels',
                transform: {
                    position: {x: 0, y: 0, z: -7.5}
                }
            }
        });

        const curtainPanel = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'CurtainPanel',
                parentId: controlPanels.value.id,
                transform: {
                    rotation: Quaternion.FromEulerAngles(30 * DegreesToRadians, 0, 0)
                }
            }
        });

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: {x: .4, y: .6, z: .05}
            },
            addCollider: true,
            actor: {
                parentId: curtainPanel.value.id
            }
        });

        const openButtonPromise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/greenCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: curtainPanel.value.id,
                transform: {
                    position: {x: -.05, y: 0, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nOpen',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const closeButtonPromise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: curtainPanel.value.id,
                transform: {
                    position: {x: .05, y: 0, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nClose',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });

        const leftButtonPromise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: curtainPanel.value.id,
                transform: {
                    position: {x: -.1, y: .13, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nLeft',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const centerButtonPromise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: curtainPanel.value.id,
                transform: {
                    position: {x: 0, y: .13, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nCenter',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const rightButtonPromise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: curtainPanel.value.id,
                transform: {
                    position: {x: .1, y: .13, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nRight',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const centerPartButtonPromise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: curtainPanel.value.id,
                transform: {
                    position: {x: 0, y: .18, z: -.026},
                    scale: {x: .0125, y: .0125, z: .01}
                },
                text: {
                    contents: 'Partial\n\n',
                    anchor: TextAnchorLocation.BottomCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 1,
                    justify: TextJustify.Center
                }
            }
        });

        const leftButton = leftButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);
        const centerButton = centerButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);
        const rightButton = rightButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);
        const centerPartButton = centerPartButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);

        // Now that the text and its animation are all being set up, we can start playing
        // the animation.
        // this.text.enableAnimation('Spin');

        // Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
        // Button behaviors have two pairs of events: hover start/stop, and click start/stop.
        const openButton = openButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);

        openButton.onHover('enter', (userId: string) => {
            console.log(`Hover entered on green button.`);
        }
        );
        openButton.onHover('exit', (userId: string) => {
            console.log(`Hover exited on green button.`);
        }
        );

        let animating = false;
        openButton.onClick('pressed', (userId: string) => {
            console.log(`Green clicked by: ${this.connectedUsers[userId].name}`);
            if (!animating) {
                this.curtains.children[1].enableAnimation('Open');
                this.curtains.children[2].enableAnimation('Open');
                this.curtains.children[3].enableAnimation('Open');
                this.curtains.children[4].enableAnimation('Open');
                this.curtains.children[5].enableAnimation('Open');
                this.curtains.children[6].enableAnimation('Open');
                this.curtains.children[7].enableAnimation('Open');
                this.curtains.children[8].enableAnimation('Open');
                this.curtains.children[9].enableAnimation('Open');

                this.curtains.children[10].enableAnimation('Open');
                this.curtains.children[11].enableAnimation('Open');
                this.curtains.children[12].enableAnimation('Open');
                this.curtains.children[13].enableAnimation('Open');
                this.curtains.children[14].enableAnimation('Open');
                this.curtains.children[15].enableAnimation('Open');
                this.curtains.children[16].enableAnimation('Open');
                this.curtains.children[17].enableAnimation('Open');
                this.curtains.children[18].enableAnimation('Open');

                animating = true;
                setTimeout(() => {
                    animating = false;
                }, 4500);
            }

            if (userId === 'dd81b3d0-541f-c9ce-3977-2c2ceec584a6') {
                console.log('Green clicked by Ben.');
            }
        }
        );

        const closeButton = closeButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);

        closeButton.onHover('enter', (userId: string) => {
            console.log(`Hover entered on red button.`);
        }
        );
        closeButton.onHover('exit', (userId: string) => {
            console.log(`Hover exited on red button.`);
        }
        );

        closeButton.onClick('pressed', (userId: string) => {
            if (!animating) {
                this.curtains.children[1].enableAnimation('Close');
                this.curtains.children[2].enableAnimation('Close');
                this.curtains.children[3].enableAnimation('Close');
                this.curtains.children[4].enableAnimation('Close');
                this.curtains.children[5].enableAnimation('Close');
                this.curtains.children[6].enableAnimation('Close');
                this.curtains.children[7].enableAnimation('Close');
                this.curtains.children[8].enableAnimation('Close');
                this.curtains.children[9].enableAnimation('Close');

                this.curtains.children[10].enableAnimation('Close');
                this.curtains.children[11].enableAnimation('Close');
                this.curtains.children[12].enableAnimation('Close');
                this.curtains.children[13].enableAnimation('Close');
                this.curtains.children[14].enableAnimation('Close');
                this.curtains.children[15].enableAnimation('Close');
                this.curtains.children[16].enableAnimation('Close');
                this.curtains.children[17].enableAnimation('Close');
                this.curtains.children[18].enableAnimation('Close');

                animating = true;
                setTimeout(() => {
                    animating = false;
                }, 4500);
            }

            console.log(`Red clicked by: ${this.connectedUsers[userId].name}`);
            if (userId === 'dd81b3d0-541f-c9ce-3977-2c2ceec584a6') {
                console.log('Red clicked by Ben.');
            }
        }
        );

        const buildingPanel = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'CurtainPanel',
                parentId: controlPanels.value.id,
                transform: {
                    position: {x: 1, y: 0, z: 0},
                    rotation: Quaternion.FromEulerAngles(30 * DegreesToRadians, 0, 0)
                }
            }
        });
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: {x: .4, y: .6, z: .05}
            },
            addCollider: true,
            actor: {
                parentId: buildingPanel.value.id
            }
        });
        const buildingButton1Promise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: buildingPanel.value.id,
                transform: {
                    position: {x: -.1, y: .18, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nOn',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const buildingButton2Promise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: buildingPanel.value.id,
                transform: {
                    position: {x: 0, y: .18, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nOff',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const buildingButton3Promise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: buildingPanel.value.id,
                transform: {
                    position: {x: .1, y: .18, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nTRT',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const buildingButton4Promise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: buildingPanel.value.id,
                transform: {
                    position: {x: -.1, y: .05, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nSmile',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const buildingButton5Promise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: buildingPanel.value.id,
                transform: {
                    position: {x: 0, y: .05, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nStar',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const buildingButton6Promise = Actor.CreateFromGLTF(this.context, {
            resourceUrl: `${url}/redCube.gltf`,
            colliderType: 'box',
            actor: {
                parentId: buildingPanel.value.id,
                transform: {
                    position: {x: .1, y: .05, z: -.026},
                    scale: {x: .025, y: .025, z: .01}
                },
                text: {
                    contents: '\n\nChecker',
                    anchor: TextAnchorLocation.TopCenter,
                    color: {r: 1, g: 1, b: 1},
                    height: 0.6,
                    justify: TextJustify.Center
                }
            }
        });
        const buildingButton1 = buildingButton1Promise.value.setBehavior(MRESDK.ButtonBehavior);
        buildingButton1.onClick('pressed', (userId: string) => {
            this.setWindows(building1.value, 'on');
            this.setWindows(building2.value, 'on');
            this.setWindows(building3.value, 'on');
        });
        const buildingButton2 = buildingButton2Promise.value.setBehavior(MRESDK.ButtonBehavior);
        buildingButton2.onClick('pressed', (userId: string) => {
            this.setWindows(building1.value, 'off');
            this.setWindows(building2.value, 'off');
            this.setWindows(building3.value, 'off');
        });
        const buildingButton3 = buildingButton3Promise.value.setBehavior(MRESDK.ButtonBehavior);
        buildingButton3.onClick('pressed', (userId: string) => {
            this.setWindows(building1.value, 'the');
            this.setWindows(building2.value, 'roof');
            this.setWindows(building3.value, 'top');
        });
        const buildingButton4 = buildingButton4Promise.value.setBehavior(MRESDK.ButtonBehavior);
        buildingButton4.onClick('pressed', (userId: string) => {
            this.setWindows(building1.value, 'smile');
            this.setWindows(building2.value, 'smile');
            this.setWindows(building3.value, 'smile');
        });
        const buildingButton5 = buildingButton5Promise.value.setBehavior(MRESDK.ButtonBehavior);
        buildingButton5.onClick('pressed', (userId: string) => {
            this.setWindows(building1.value, 'star');
            this.setWindows(building2.value, 'star');
            this.setWindows(building3.value, 'star');
        });
        const buildingButton6 = buildingButton6Promise.value.setBehavior(MRESDK.ButtonBehavior);
        buildingButton6.onClick('pressed', (userId: string) => {
            this.setWindows(building1.value, 'checker');
            this.setWindows(building2.value, 'checker');
            this.setWindows(building3.value, 'checker');
        });

        const spotLightPromise = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'SpotLight',
                transform: {
                    position: {x: 0, y: 4, z: 0},
                    rotation: Quaternion.FromEulerAngles(0, -90 * DegreesToRadians, 0)
                }
            }
        });
        this.spotLight = spotLightPromise.value;
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: {x: 0.4, y: 0.4, z: 0.5},
                radius: 0.15
            },
            actor: {
                name: 'light',
                parentId: spotLightPromise.value.id
            }
        });
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: {x: 0.4, y: 0.4, z: 10},
                radius: 0.01
            },
            actor: {
                parentId: spotLightPromise.value.id,
                name: 'beam',
                transform: {
                    position: {x: 0, y: 0, z: 5}
                }
            }
        });

        // console.log(Object.keys(this.connectedUsers)[0]);
        // spotLight.value.lookAt('f210445f-d913-1592-913d-f6a0a818e875', LookAtMode.TargetXY);

        const collisionTest = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: {x: .5, y: .5, z: .5}
            },
            addCollider: true,
            actor: {
                collider: {
                    enabled: true,
                    isTrigger: true
                },
                transform: {
                    position: {x: 0, y: .5, z: -20}
                }
            }
        });
        collisionTest.value.onTriggerEnter((col: MRESDK.CollisionData) => {
            console.log(col);
        });
        collisionTest.value.onCollisionEnter((col: MRESDK.CollisionData) => {
            console.log(col);
        });

        // MRESDK.Actor.CreateFromLibrary(this.context, {
        //     resourceId: '1116239105672347773',
        //     actor: {
        //         transform: {
        //             position: {x: 0, y: 0, z: -20}
        //         }
        //     }
        // });
    }

    private addWindows(building: Actor) {
        for (let i = 0; i < 100; i++) {
            let x = -9 + (i * 2);
            let y = 33;
            if (i > 9) {
                y = y - 3;
                x = -9 + ((i - 10) * 2);
            }
            if (i > 19) {
                y = y - 3;
                x = -9 + ((i - 20) * 2);
            }
            if (i > 29) {
                y = y - 3;
                x = -9 + ((i - 30) * 2);
            }
            if (i > 39) {
                y = y - 3;
                x = -9 + ((i - 40) * 2);
            }
            if (i > 49) {
                y = y - 3;
                x = -9 + ((i - 50) * 2);
            }
            if (i > 59) {
                y = y - 3;
                x = -9 + ((i - 60) * 2);
            }
            if (i > 69) {
                y = y - 3;
                x = -9 + ((i - 70) * 2);
            }
            if (i > 79) {
                y = y - 3;
                x = -9 + ((i - 80) * 2);
            }
            if (i > 89) {
                y = y - 3;
                x = -9 + ((i - 90) * 2);
            }
            const window = MRESDK.Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: MRESDK.PrimitiveShape.Plane,
                    dimensions: {x: 1, y: 1, z: 1.5}
                },
                actor: {
                    parentId: building.id,
                    tag: 'on',
                    transform: {
                        position: {x: x, y: y, z: 0.1},
                        rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 0, 0)
                    }
                }
            });
            window.value.createAnimation(
                "Off", {
                keyframes: [{
                    time: 0,
                    value: {transform: {rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 0, 0)}}
                }, {
                    time: 1,
                    value: {transform: {rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 180 * DegreesToRadians, 0)}}
                }, {
                    time: 1.1,
                    value: {transform: {rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 180 * DegreesToRadians, 0)}}
                }],
                events: []
            }).catch(reason => console.log(`Failed to create spin animation: ${reason}`));
            window.value.createAnimation(
                "On", {
                keyframes: [{
                    time: 0,
                    value: {transform: {rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 180 * DegreesToRadians, 0)}}
                }, {
                    time: 1,
                    value: {transform: {rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 0, 0)}}
                }, {
                    time: 1.1,
                    value: {transform: {rotation: Quaternion.FromEulerAngles(-90 * DegreesToRadians, 0, 0)}}
                }],
                events: []
            }).catch(reason => console.log(`Failed to create spin animation: ${reason}`));
        }
    }

    private setWindows(building: Actor, str: string) {
        switch (str) {
            case 'off':
            str = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
            break;
          case 'on':
            str = '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
            break;
          case 't':
            str = '0000000000001111110000111111000000110000000011000000001100000000110000000011000000001100000000000000';
            break;
          case 'r':
            str = '0000000000001111000000111111000011001100001111110000111100000011011000001100110000110011000000000000';
            break;
          case 'checker':
            str = '0101010101101010101001010101011010101010010101010110101010100101010101101010101001010101011010101010';
            break;
          case 'smile':
            str = '0000000000000000000000110011000011001100000000000001000000100010000100000111100000000000000000000000';
            break;
          case 'penis':
            str = '0001110000001010100000100010000010001000001000100000100010000100000100100000001010001000100111011100';
            break;
          case 'star':
            str = '0000010000000011100000001110000111111111001111111000011111000001111100001110111000110001100000000000';
            break;
          case 'the':
            str = '1110000000010000000001000000000101010000000111000000010100000001010111000000011000000001000000000111';
            break;
          case 'roof':
            str = '1100000000101001110011000101001010010100000001110001110000000101001110010100110001110010000000001000';
            break;
          case 'top':
            str = '1110000000010000000001000000000101110000000101000000010100000001110111000000010100000001110000000100';
            break;
          default:
            str = str;
            break;
        }
        // console.log(str);
        // console.log(building.children[0].transform.rotation);
        for (let i = 0; i < str.length; i++) {
          if (str.charAt(i) === '0') {
            // building.children[i].transform.rotation.set(0.707, 0, 0, 0.707);
            if (building.children[i].tag === 'on') {
                building.children[i].enableAnimation('Off');
                building.children[i].tag = 'off';
            }
          } else {
            // building.children[i].transform.position.set(0, 1000, 0);
            if (building.children[i].tag === 'off') {
                building.children[i].enableAnimation('On');
                building.children[i].tag = 'on';
            }
          }
        }
        // console.log(building.children[0].transform.rotation);
        // console.log(building.children[3].transform.rotation);
    }

    /**
     * Generate keyframe data for a simple spin animation.
     * @param duration The length of time in seconds it takes to complete a full revolution.
     * @param axis The axis of rotation in local space.
     */
    private generateCurtainframes(dur: number, from: number, to: number, delay: number): AnimationKeyframe[] {
        return [{
            time: delay + (0 * dur),
            value: {transform: {rotation: Quaternion.RotationAxis(Vector3.Up(), from * DegreesToRadians)}}
        }, {
            time: delay + (0.5 * dur),
            value: {transform: {rotation: Quaternion.RotationAxis(Vector3.Up(), ((from + to) / 2) * DegreesToRadians)}}
        }, {
            time: delay + (1 * dur),
            value: {transform: {rotation: Quaternion.RotationAxis(Vector3.Up(), to * DegreesToRadians)}}
        }, {
            time: delay + (1.1 * dur),
            value: {transform: {rotation: Quaternion.RotationAxis(Vector3.Up(), to * DegreesToRadians)}}
        }];
    }

    private growAnimationData: AnimationKeyframe[] = [{
        time: 0,
        value: { transform: { scale: { x: 0.4, y: 0.4, z: 0.4 } } }
    }, {
        time: 0.3,
        value: { transform: { scale: { x: 0.5, y: 0.5, z: 0.5 } } }
    }];

    private shrinkAnimationData: AnimationKeyframe[] = [{
        time: 0,
        value: { transform: { scale: { x: 0.5, y: 0.5, z: 0.5 } } }
    }, {
        time: 0.3,
        value: { transform: { scale: { x: 0.4, y: 0.4, z: 0.4 } } }
    }];
}
