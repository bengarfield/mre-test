import { Context } from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
    private context;
    private baseUrl;
    private text;
    private cube;
    private curtains;
    constructor(context: Context, baseUrl: string);
    private userJoined;
    private userLeft;
    /**
     * Once the context is "started", initialize the app.
     */
    private started;
    /**
     * Generate keyframe data for a simple spin animation.
     * @param duration The length of time in seconds it takes to complete a full revolution.
     * @param axis The axis of rotation in local space.
     */
    private generateCurtainframes;
    private growAnimationData;
    private shrinkAnimationData;
}
//# sourceMappingURL=app.d.ts.map