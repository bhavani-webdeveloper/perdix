irf.models.factory('Messaging', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "$q",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
        var endpoint = irf.MANAGEMENT_BASE_URL + '/server-ext/messaging/';

        var res = $resource(endpoint, null, {
            getMessages: searchResource({
                method: 'GET',
                url: endpoint + 'getConversation.php'
            }),
            createConversation: searchResource({
                method: 'POST',
                url: endpoint + 'createConversation.php'   
            }),
            addMessage: searchResource({
                method: 'POST',
                url: endpoint + 'addMessage.php'   
            }),
            
        });

        return res;
    }
]);
irf.models.directive("irfMessaging", [function() {
    return {
        restrict: "E",
        template: `
<div ng-if="expand">
    <div ng-repeat="msg in conversation.messages" class="box box-widget" style="font-size:14px;margin-bottom:0">
        <div class="box-footer box-comments">
            <div class="box-comment">
                <img class="img-circle img-sm" src="img/unknownUser.jpg">
                <div class="comment-text">
                    <span class="username">
                        {{msg.created_by}}
                        <span class="text-muted pull-right">
                            {{momentCalendar(msg.created_at)}}
                        </span>
                    </span>
                    <span ng-bind-html="highlightUsernames(msg.message_text)"></span>
                </div>
            </div>
            <a href="" ng-hide="readonly && !msg.replies.length" ng-click="msg._showReplies=!msg._showReplies" class="color-theme" style="position:absolute;right:10px;margin-top:-10px">{{msg.replies.length?((msg._showReplies?(\'HIDE_REPLIES\'|translate):(\'VIEW_REPLIES\'|translate)+\' (\'+msg.replies.length+\')\')):(msg._showReplies?\'\':(\'REPLY\'|translate))}}</a>
            <div ng-if="msg._showReplies" class="box-comments" style="margin-left: 15px; border-left: 3px solid #c1c1c1; padding: 8px 0 0 15px;">
                <div ng-repeat="reply in msg.replies" class="box-comment">
                    <img class="img-circle img-sm" src="img/unknownUser.jpg">
                    <div class="comment-text">
                        <span class="username">
                            {{reply.created_by}}
                            <span class="text-muted pull-right">
                                {{momentCalendar(reply.created_at)}}
                            </span>
                        </span>
                        <span ng-bind-html="highlightUsernames(reply.message_text)"></span>
                        &nbsp;<a ng-hide="readonly" href="" class="color-theme" ng-click="msg._reply=msg._reply?msg._reply:\'@\'+reply.created_by+\' \';" onclick="$(\'#in_reply_\'+$(this).attr(\'msgid\')).focus()" ng-attr-msgid="{{msg.id}}"><i class="fa fa-reply">&nbsp;</i>{{'REPLY'|translate}}</a>
                    </div>
                </div>
                <div ng-hide="readonly" style="padding-top:10px">
                    <img class="img-responsive img-circle img-sm" src="img/unknownUser.jpg">
                    <div class="img-push">
                        <div class="input-group">
                            <input type="text" ng-model="msg._reply" ng-attr-id="in_reply_{{msg.id}}" class="form-control" placeholder="Reply here" style="background-color:transparent">
                            <span class="input-group-btn">
                                <button class="btn btn-theme btn-flat" ng-click="addReply(conversation, msg)">{{'REPLY'|translate}}</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div ng-hide="readonly || !conversation.messages.length" class="box-footer">
        <img class="img-responsive img-circle img-sm" src="img/unknownUser.jpg">
        <div class="img-push">
            <div class="input-group">
                <input type="text" ng-model="conversation._msg" class="form-control" placeholder="Add message here">
                <span class="input-group-btn">
                    <button ng-click="addMessage(conversation)" class="btn btn-theme btn-flat">{{'ADD_MESSAGE'|translate}}</button>
                </span>
            </div>
        </div>
    </div>
    <span ng-if="!conversation.messages && readonly" style="text-align: center;display: block;">Conversation is not available</span>
    <div ng-hide="readonly || conversation.messages.length" class="box-footer">
        <img class="img-responsive img-circle img-sm" src="img/unknownUser.jpg">
        <div class="img-push">
            <div class="input-group">
                <input type="text" ng-model="_conversationMsg" class="form-control" placeholder="Enter message here">
                <span class="input-group-btn">
                    <button ng-click="createConversation(_conversationMsg)" class="btn btn-theme btn-flat">{{'CREATE_CONVERSATION'|translate}}</button>
                </span>
            </div>
        </div>
    </div>
</div>
`,
        scope: {
            processId: "=",
            subProcessId: "=",
            conversation: "=",
            expand: "=",
            readonly: "="
        },
        controller: ["$scope", "$log", "Messaging","PageHelper", "SessionStore", function($scope, $log, Messaging, PageHelper, SessionStore) {
            var created_by = SessionStore.getLoginname();

            $scope.highlightUsernames = function(msg_text) {
                return msg_text.replace(/(\@([a-zA-Z0-9_]+)) /g, ' <strong>$2</strong> ');
            }

            $scope.momentCalendar = function(date) {
                return moment(date, "YYYY-MM-DD[T]hh:mm:ss[Z]").calendar();
            }

            var getConversation = function() {
                PageHelper.showLoader();
                Messaging.getMessages({
                    'process_id': $scope.processId,
                    'sub_process_id': $scope.subProcessId
                }).$promise.then(function(response) {
                    $scope.conversation = response.body;
                }).finally(PageHelper.hideLoader);
            };

            $scope.createConversation = function(conversationMsg) {
                $scope.conversation = {};
                if(conversationMsg) {
                    PageHelper.showLoader();
                    Messaging.createConversation({
                        'process_id': $scope.processId,
                        'sub_process_id': $scope.subProcessId,
                        "message_text": conversationMsg,
                        "created_by": created_by
                    }).$promise.then(function(response) {
                        getConversation();
                    }, PageHelper.hideLoader);
                }
                return false;
            };

            $scope.addMessage = function(conversation) {
                if (conversation._msg) {
                    PageHelper.showLoader();
                    Messaging.addMessage({
                        "conversation_id": conversation.id,
                        "message_text": conversation._msg,
                        "created_by": created_by
                    }).$promise.then(function(response) {
                        conversation._msg = '';
                        response.body.replies = [];
                        conversation.messages.push(response.body);
                    }).finally(PageHelper.hideLoader);
                }
                return false;
            }

            $scope.addReply = function(conversation, message) {
                if (message._reply) {
                    PageHelper.showLoader();
                    Messaging.addMessage({
                        "conversation_id": conversation.id,
                        'reply_reference_id': message.id,
                        "message_text": message._reply,
                        created_by: created_by
                    }).$promise.then(function(response) {
                        message.replies.push(response.body);
                        message._reply = '';
                    }).finally(PageHelper.hideLoader);
                }
                return false;
            }

            var clearWatch = $scope.$watch('expand', function(n, o) {
                if (n) {
                    clearWatch();
                    getConversation();
                }
            });
        }]
    };
}]);