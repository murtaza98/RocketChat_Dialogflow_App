import {
    IConfigurationExtend,
    IConfigurationModify,
    IEnvironmentRead,
    ILogger,
    IRead,
    IHttp,
    IPersistence,
    IModify,
    IHttpResponse,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IPostMessageSent, IMessage } from '@rocket.chat/apps-engine/definition/messages';

export class DialogflowIntegrationFirstApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async initialize(): Promise<void> {
        this.getLogger().log('Hello world from my app');
    }

    public async executePostMessageSent(message: IMessage, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<void> {

        this.getLogger().log(`app.${ this.getNameSlug() }`);
        this.getLogger().log(message.sender.username);
        if (message.sender.username === `app.${ this.getNameSlug() }`) {
            return;
        }

        http.get('http://127.0.0.1:4000/').then(
            (response) => {
                this.getLogger().log('resolved');
                const builder = modify.getNotifier().getMessageBuilder();
                builder.setRoom(message.room).setText((message.text || '') + response);
                modify.getCreator().finish(builder);
            },
        )
        .catch(
            () => this.getLogger().log('error')
        );
    }
}
