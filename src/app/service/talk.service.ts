import { Injectable } from '@angular/core';
import Talk from 'talkjs';
import {AuthenticationService} from "./authentication.service";
import {User} from "../model/user";
import {Deferred} from "../utils/deferred";

@Injectable({
  providedIn: 'root'
})
export class TalkService
{
  private static APP_ID = 'tVZphwxa';
  private currentTalkUser!: Talk.User;
  private currentSessionDeferred = new Deferred<Talk.Session>();

  constructor(private authenticationService: AuthenticationService) { }

  async createTalkUser(applicationUser: User): Promise<Talk.User>
  {
    await Talk.ready;
    const name = applicationUser.firstName + ' ' + applicationUser.lastName;

    return new Talk.User
    ({
      id: applicationUser.id,
      name: name,
      photoUrl: applicationUser.profileImageUrl
    })
  }

  async createCurrentSession()
  {
    await Talk.ready;

    const currentUser = await this.authenticationService.getUserFromLocalCache();
    const currentTalkUser = await this.createTalkUser(currentUser);

    const session = new Talk.Session
    ({
      appId: TalkService.APP_ID,
      me: currentTalkUser
    })

    this.currentTalkUser = currentTalkUser;
    this.currentSessionDeferred.resolve(session);
  }

   async destroyCurrentSession()
   {
     await this.currentSessionDeferred.promise.then((session) =>
     {
       if(session)
       {
         session.destroy();
       }
     })
   }

  async createPopup(otherAppUser: User, keepOpen: boolean): Promise<Talk.Popup>
  {
    const session = await this.currentSessionDeferred.promise;
    const conversationBuilder = await this.getOrCreateConversation(session, otherAppUser);
    if(session.getPopups().length != 0)
    {
      session.getPopups().forEach((popup) =>
      {
        popup.destroy();
      });
    }
    const popup = session.createPopup(conversationBuilder, {keepOpen: keepOpen});

    return popup;
  }

  async createInbox(): Promise<Talk.Inbox>
  {
    const session = await this.currentSessionDeferred.promise;
    return session.createInbox({selected: null});
  }

  private async getOrCreateConversation(session: Talk.Session, otherApplicationUser: User)
  {
    const otherTalkUser = await this.createTalkUser(otherApplicationUser);
    const  conversationBuilder = session.getOrCreateConversation(Talk.oneOnOneId(this.currentTalkUser, otherTalkUser));

    conversationBuilder.setParticipant(this.currentTalkUser);
    conversationBuilder.setParticipant(otherTalkUser);

    return conversationBuilder;
  }

  async createChatbox(otherApplicationUser: User) : Promise<Talk.Chatbox>
  {
    const session = await this.currentSessionDeferred.promise;
    const conversationBuilder = await this.getOrCreateConversation(session, otherApplicationUser);
    return session.createChatbox(conversationBuilder);
  }
}
