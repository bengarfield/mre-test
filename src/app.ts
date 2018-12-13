/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import {
    Actor,
    AnimationKeyframe,
    AnimationWrapMode,
    ButtonBehavior,
    Context,
    DegreesToRadians,
    Quaternion,
    TextAnchorLocation,
    TextJustify,
    Vector3
} from '@microsoft/mixed-reality-extension-sdk';

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
    private text: Actor = null;
    private cube: Actor = null;
    private curtains: Actor = null;

    constructor(private context: Context, private baseUrl: string) {
        this.context.onUserJoined(user => this.userJoined(user));
        this.context.onUserLeft(user => this.userLeft(user));
        this.context.onStarted(() => this.started());
    }

    private userJoined(user: MRESDK.User) {
        this.context.logger.log('info', `user-joined: ${user.name}, ${user.id}`);
    }

    private userLeft(user: MRESDK.User) {
        this.context.logger.log('info', `user-left: ${user.name}`);
    }

    /**
     * Once the context is "started", initialize the app.
     */
    private async started() {

        const url = 'https://mre-rooftop.herokuapp.com';
        this.context.logger.log('info', `baseUrl: ${this.baseUrl}`);

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
        //     // The name is a unique identifier for this animation. We'll pass it to "startAnimation" later.
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
                    position: {x: 0, y: 2, z: 4.6},
                    scale: {x: 11, y: 1, z: 11}
                }
            }
        });
        this.curtains = curtainPromise.value;

        // this.curtains.createAnimation({
        //     // The name is a unique identifier for this animation. We'll pass it to "startAnimation" later.
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
                    // Parent the glTF model to the text actor.
                    parentId: curtainPiece.value.id,
                    transform: {
                        position: {x: 0, y: -1, z: -1},
                        scale: {x: 0.0875 / 2, y: 1 / 2, z: 4 / 2},
                        rotation: Quaternion.FromEulerAngles(90 * DegreesToRadians, 0, 0)
                    }
                }
            });
        }
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
            this.curtains.children[i].createAnimation({
                animationName: "Open",
                keyframes: this.generateCurtainframes(i < 10 ? 0 + (.5 * i) : 4.5 - (.5 * (i - 10)),
                    -47.5 + (5 * i), i < 10 ? -47.5 : 47.5, 0),
                events: []
            }).catch(reason => this.context.logger.log('error', `Failed to create spin animation: ${reason}`));
            this.curtains.children[i].createAnimation({
                animationName: "Close",
                keyframes: this.generateCurtainframes(i < 10 ? 0 + (.5 * i) : 4.5 - (.5 * (i - 10)),
                    i < 10 ? -47.5 : 47.5, -47.5 + (5 * i), i < 10 ? 4.5 - (.5 * i) : 0 + (.5 * (i - 10))),
                events: []
            }).catch(reason => this.context.logger.log('error', `Failed to create spin animation: ${reason}`));
        }
        
        // <a-entity id='building1' position='-13 12 -40' scale='.5 .5 .5'></a-entity>
        
        const building1 = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Building1',
                transform: {
                    position: {x: -13, y: 12, z: -40},
                    scale: {x: 0.5, y: 0.5, z: 0.5}
                }
            }
        });

        const controlPanels = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'ControlPanels',
                transform: {
                    position: {x: 0, y: 0, z: 7.5}
                }
            }
        });

        const curtainPanel = MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                name: 'CurtainPanel',
                parentId: controlPanels.value.id,
                transform: {
                    rotation: Quaternion.FromEulerAngles(-30 * DegreesToRadians, 0, 0)
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
                    position: {x: .05, y: 0, z: .026},
                    scale: {x: .025, y: .025, z: .01},
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
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
                    position: {x: -.05, y: 0, z: .026},
                    scale: {x: .025, y: .025, z: .01},
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
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
                    position: {x: .1, y: .13, z: .026},
                    scale: {x: .025, y: .025, z: .01},
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
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
                    position: {x: 0, y: .13, z: .026},
                    scale: {x: .025, y: .025, z: .01},
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
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
                    position: {x: -.1, y: .13, z: .026},
                    scale: {x: .025, y: .025, z: .01},
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
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
                    position: {x: 0, y: .18, z: .026},
                    scale: {x: .0125, y: .0125, z: .01},
                    rotation: Quaternion.FromEulerAngles(0, 180 * DegreesToRadians, 0)
                },
                text: {
                    contents: 'Partial\n',
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
        // this.text.startAnimation('Spin');

        // Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
        // Button behaviors have two pairs of events: hover start/stop, and click start/stop.
        const openButton = openButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);

        // Trigger the grow/shrink animations on hover.
        openButton.onHover('enter', (userId: string) => {
            // this.redCube.startAnimation('GrowIn');
            this.context.logger.log('info', `Hover entered on green button.`);
        }
        );
        openButton.onHover('exit', (userId: string) => {
            // this.redCube.startAnimation('ShrinkOut');
            this.context.logger.log('info', `Hover exited on green button.`);
        }
        );

        let animating = false;
        openButton.onClick('pressed', (userId: string) => {
            this.context.logger.log('info', `Green clicked by: ${userId}`);
            if (!animating) {
                this.curtains.children[1].startAnimation('Open');
                this.curtains.children[2].startAnimation('Open');
                this.curtains.children[3].startAnimation('Open');
                this.curtains.children[4].startAnimation('Open');
                this.curtains.children[5].startAnimation('Open');
                this.curtains.children[6].startAnimation('Open');
                this.curtains.children[7].startAnimation('Open');
                this.curtains.children[8].startAnimation('Open');
                this.curtains.children[9].startAnimation('Open');

                this.curtains.children[10].startAnimation('Open');
                this.curtains.children[11].startAnimation('Open');
                this.curtains.children[12].startAnimation('Open');
                this.curtains.children[13].startAnimation('Open');
                this.curtains.children[14].startAnimation('Open');
                this.curtains.children[15].startAnimation('Open');
                this.curtains.children[16].startAnimation('Open');
                this.curtains.children[17].startAnimation('Open');
                this.curtains.children[18].startAnimation('Open');

                animating = true;
                setTimeout(() => {
                    animating = false;
                }, 4500);
            }

            if (userId === 'dd81b3d0-541f-c9ce-3977-2c2ceec584a6') {
                this.context.logger.log('info', 'Green clicked by Ben.');
            }
        }
        );

        const closeButton = closeButtonPromise.value.setBehavior(MRESDK.ButtonBehavior);

        // Trigger the grow/shrink animations on hover.
        closeButton.onHover('enter', (userId: string) => {
            this.context.logger.log('info', `Hover entered on red button.`);
        }
        );
        closeButton.onHover('exit', (userId: string) => {
            this.context.logger.log('info', `Hover exited on red button.`);
        }
        );

        // When clicked, do a 360 sideways.
        closeButton.onClick('pressed', (userId: string) => {
            if (!animating) {
                this.curtains.children[1].startAnimation('Close');
                this.curtains.children[2].startAnimation('Close');
                this.curtains.children[3].startAnimation('Close');
                this.curtains.children[4].startAnimation('Close');
                this.curtains.children[5].startAnimation('Close');
                this.curtains.children[6].startAnimation('Close');
                this.curtains.children[7].startAnimation('Close');
                this.curtains.children[8].startAnimation('Close');
                this.curtains.children[9].startAnimation('Close');

                this.curtains.children[10].startAnimation('Close');
                this.curtains.children[11].startAnimation('Close');
                this.curtains.children[12].startAnimation('Close');
                this.curtains.children[13].startAnimation('Close');
                this.curtains.children[14].startAnimation('Close');
                this.curtains.children[15].startAnimation('Close');
                this.curtains.children[16].startAnimation('Close');
                this.curtains.children[17].startAnimation('Close');
                this.curtains.children[18].startAnimation('Close');

                animating = true;
                setTimeout(() => {
                    animating = false;
                }, 4500);
            }

            this.context.logger.log('info', `Red clicked by: ${userId}`);
            if (userId === 'dd81b3d0-541f-c9ce-3977-2c2ceec584a6') {
                this.context.logger.log('info', 'Red clicked by Ben.');
            }
        }
        );

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
