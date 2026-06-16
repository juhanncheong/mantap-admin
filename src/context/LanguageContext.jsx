import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const LanguageContext = createContext(null);

const STORAGE_KEY = "admin_language";

const translations = {
  en: {
    brand: "曼达【MANTAP】集团",

    nav: {
      dashboard: "Dashboard",
      users: "Users",
      kyc: "KYC",
      withdrawals: "Withdrawals",
      deposits: "Deposits",
      orderList: "Order List",
      guestEmails: "Guest Emails",
      trialBonus: "Trial Bonus",
      bonusCredit: "Bonus Credit",
      invitationCodes: "Invitation Codes",
      luckyDraw: "Lucky Draw",
      bonusTriggers: "Bonus Triggers",
      popups: "Popups",
      orderPool: "Order Pool",
      signinRewards: "Sign-in Rewards",
      settings: "Settings",
      content: "Content",
      events: "Events",
      page: "Page",
    },

    common: {
      logout: "Log out",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      refresh: "Refresh",
      readAll: "Read all",
      close: "Close",
      dragToMoveTab: "Drag to move tab",
      language: "Language",
      english: "English",
      chinese: "中文",
    },

    notifications: {
      title: "Notifications",
      unread: "unread",
      youHaveUnread: "You have {{count}} unread notifications",
      loading: "Loading notifications...",
      empty: "No notifications yet.",
      fallbackTitle: "Notification",
      failedLoad: "Failed to load notifications",
      failedMarkRead: "Failed to mark notification as read",
      failedMarkAllRead: "Failed to mark all as read",
      user: "User",
      unknown: "Unknown",
      matched: "matched",
    },

    dashboard: {
      title: "Dashboard",
      overview: "Dashboard Overview",

      refreshData: "Refresh Data",
      refreshing: "Refreshing...",

      totalUsers: "Total Users",
      admins: "Admins",
      banned: "Banned",
      bannedUsers: "Banned Users",
      availableUsers: "Available Users",

      pendingWithdrawals: "Pending Withdrawals",
      pendingWithdraw: "Pending Withdraw",
      pendingAmount: "Pending amount",

      depositQty: "Deposit Qty",
      withdrawalQty: "Withdrawal Qty",
      depositRangeSub: "DEPOSIT records in selected date range",
      withdrawalRangeSub: "Withdrawal records in selected date range",

      rangePerformance: "Range Performance $",
      liveSummary: "Live Summary",
      deposits: "Deposits",
      withdrawals: "Withdrawals",

      coreAccountHealth: "Core Account Health",
      realTime: "Real-time",
      viewFullDetails: "View Full Details",

      rangeSummary: "Deposit & Withdrawal Range Summary",
      rangeFilterDesc: "Filter records by your local PC time",
      resetToday: "Reset to Today",
      startDateTime: "Start Date & Time",
      endDateTime: "End Date & Time",
      rangeStart: "Range Start",
      rangeEnd: "Range End",
      invalidRange: "Start date/time cannot be later than end date/time.",

      depositAmount: "Deposit Amount",
      withdrawalAmount: "Withdrawal Amount",
      depositRecords: "Deposit Records",
      withdrawalRecords: "Withdrawal Records",

      userManagement: "User Management",
      userManagementDesc:
        "Manage balances, roles, rounds, bans, and account control settings.",
      withdrawalsDesc:
        "Review pending requests and move quickly into approve or reject workflows.",

      recentWithdrawals: "Recent Withdrawals",
      latestWithdrawals: "Latest 5 withdrawal records",
      viewAll: "View all",
      noWithdrawals: "No withdrawals found.",

      date: "Date",
      user: "User",
      amount: "Amount",
      status: "Status",
      unknown: "Unknown",

      failedLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      failedLoad: "Failed to load dashboard",
      requestFailed: "Request failed",
    },

    adminKyc: {
      title: "KYC Verification",
      subtitle:
        "Review identity verification submissions and approve or reject users.",
      searchPlaceholder: "Search name, UID, phone, document...",
      allStatus: "All Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      refresh: "Refresh",
      submissions: "KYC Submissions",
      action: "Action",
      user: "User",
      phone: "Phone",
      fullName: "Full Name",
      document: "Document",
      documentType: "Document Type",
      documentNumber: "Document Number",
      status: "Status",
      submitted: "Submitted",
      submittedAt: "Submitted At",
      reviewedAt: "Reviewed At",
      rejectionReason: "Rejection Reason",
      noSubmissions: "No KYC submissions found.",
      view: "View",
      reviewTitle: "KYC Review",
      close: "Close",
      documentImages: "Document Images",
      clickImageHint: "Click an image to open it in a new tab.",
      frontDocument: "Front Document",
      backDocument: "Back Document",
      frontDocumentAlt: "Front document",
      backDocumentAlt: "Back document",
      noFrontImage: "No front image uploaded.",
      noBackImage: "No back image uploaded.",
      submittedDetails: "Submitted Details",
      detailsHint:
        "Check that the submitted information matches the documents.",
      reviewDecision: "Review Decision",
      reviewDecisionHint:
        "Approving KYC will move waiting withdrawals to pending. Rejecting KYC will reject waiting withdrawals and return balance.",
      approveKyc: "Approve KYC",
      rejectKyc: "Reject KYC",
      rejectReasonPlaceholder: "Enter rejection reason...",
      currentStatus: "Current Status",

      nationalId: "National ID",
      passport: "Passport",
      driversLicense: "Driver's License",

      pleaseLoginAgain: "Please login again.",
      requestFailed: "Request failed",
      failedLoad: "Failed to load KYC submissions",
      confirmApprove: "Approve this KYC verification?",
      confirmReject: "Reject this KYC verification?",
      approvedToast: "KYC approved",
      rejectedToast: "KYC rejected",
      failedApprove: "Failed to approve KYC",
      failedReject: "Failed to reject KYC",
      enterRejectReason: "Please enter rejection reason",
    },

    guestEmails: {
      title: "Guest Emails",
      refresh: "Refresh",
      sendEmail: "Send Email",
      sendNow: "Send Now",
      sending: "Sending...",
      cancel: "Cancel",
      close: "Close",
      view: "View",
      historyTitle: "Sent Email History",
      showingRecords: "Showing {{shown}} of {{total}} records",
      searchPlaceholder: "Search email, title, description...",
      guestRecipient: "Guest recipient",
      emptyTitle: "No email records found",
      emptySubtitle: "Click Send Email to create your first guest email.",

      stats: {
        totalEmails: "Total Emails",
        sent: "Sent",
        failed: "Failed",
        today: "Today",
      },

      status: {
        sent: "Sent",
        failed: "Failed",
        pending: "Pending",
      },

      table: {
        status: "Status",
        guestEmail: "Guest Email",
        emailTitle: "Title",
        description: "Description",
        brevoId: "Brevo ID",
        sentAt: "Sent At",
        action: "Action",
      },

      modal: {
        sendTitle: "Send Guest Email",
        sendSubtitle:
          "Create a polished Brevo template email with a custom title and message.",
        footerHint: "This will send immediately through your Brevo template.",
      },

      form: {
        guestEmail: "Guest Email",
        guestEmailPlaceholder: "guest@example.com",
        emailTitle: "Email Title",
        emailTitlePlaceholder: "Example: Welcome to Our Platform",
        description: "Description",
        descriptionPlaceholder: "Write the message details here...",
      },

      preview: {
        title: "Live Preview",
        badge: "Brevo Template",
        emptyTitle: "Your email title will appear here",
        emptyDescription:
          "Your email description will appear here. This is the content passed into {{ params.description }} inside your Brevo template.",
        recipient: "Recipient",
      },

      details: {
        title: "Email Details",
        subtitle:
          "Review the exact title, description, recipient, and delivery status.",
        status: "Status",
        recipient: "Recipient",
        sentAt: "Sent At",
        emailTitle: "Email Title",
        description: "Description",
        brevoMessageId: "Brevo Message ID",
      },

      success: {
        sent: "Email sent successfully",
      },

      errors: {
        loginAgain: "Please login again.",
        nonJson: "Server returned non-JSON response.",
        requestFailed: "Request failed ({{status}})",
        loadFailed: "Failed to load email history",
        sendFailed: "Failed to send email",
        emailRequired: "Guest email is required",
        invalidEmail: "Please enter a valid email address",
        titleRequired: "Title is required",
        titleTooLong: "Title must be 150 characters or less",
        descriptionRequired: "Description is required",
        descriptionTooLong: "Description must be 5000 characters or less",
      },
    },

    users: {
      title: "User Management",
      subtitle: "Manage users, balances, roles, and online activity",

      searchPlaceholder: "Search phone / UID / IP...",
      allRoles: "All roles",
      user: "user",
      admin: "admin",
      refresh: "Refresh",
      createUser: "+ Create User",

      sortUsers: "Sort users",
      sortNewest: "Sort: Newest",
      sortOldest: "Sort: Oldest",
      sortLastOnline: "Sort: Last Online",
      sortHighestBalance: "Sort: Highest Balance",
      sortLowestBalance: "Sort: Lowest Balance",
      sortMostOrders: "Sort: Most Orders",
      sortLeastOrders: "Sort: Least Orders",
      sortHighestPending: "Sort: Highest Pending",

      usersCount: "Users",
      actions: "Actions",
      phone: "Phone",
      phoneNumber: "Phone Number",
      userId: "User ID",
      referrer: "Referrer",
      country: "Country",
      pending: "Pending",
      balance: "Balance",
      addBalance: "Add Balance",
      orders: "Orders",
      orderControls: "Order Controls",
      rounds: "Rounds",
      registeredIp: "Registered IP",
      lastOnline: "Last Online",
      created: "Created",
      role: "Role",

      noUsersFound: "No users found.",
      more: "More",
      banned: "BANNED",
      doubleClickCopyUid: "Double-click to copy UID",
      add: "Add",
      save: "Save",
      reset: "Reset",
      cancel: "Cancel",
      close: "Close",
      saving: "Saving...",
      creating: "Creating...",
      deleting: "Deleting...",

      showing: "Showing",
      to: "to",
      of: "of",
      users: "users",
      perPage: "Per page",
      prev: "Prev",
      next: "Next",
      page: "Page",

      noUidToCopy: "No UID to copy",
      uidCopied: "UID copied",
      failedCopyUid: "Failed to copy UID",
      failedLoadUsers: "Failed to load users",
      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",

      addSubtractBalance: "Add / Subtract balance",
      saveOrdersCompleted: "Save ordersCompleted",
      saveTotalResetCount: "Save totalResetCount",
      resetToZero: "Reset to 0",

      userLabel: "User",
      old: "Old",
      current: "Current",
      reason: "Reason",
      reasonOptional: "Reason (optional)",
      amount: "Amount",
      mode: "Mode",
      password: "Password",
      newPassword: "New Password",
      newPin: "New PIN",
      newPhoneNumber: "New Phone Number",

      userNotFound: "User not found",

      freezeWithdrawal: "Freeze Withdrawal",
      unfreezeWithdrawal: "Unfreeze Withdrawal",
      confirmFreeze: "Confirm Freeze",
      freezeWarning: "This will block the user from creating withdrawals.",
      freezeReasonPlaceholder:
        "Example: Risk review / Suspicious activity / Manual hold",
      freezeWithdrawalDesc: "Block this user from withdrawing",
      unfreezeWithdrawalDesc: "Allow this user to withdraw again",

      editBalance: "Edit Balance",
      addSubtract: "Add / Subtract",
      useNegative: "Use negative to subtract (example: -50)",
      setBalance: "Set Balance",
      replaceBalance: "Replace balance to exact value",
      amountIncPlaceholder: "Example: 100 or -50",
      amountSetPlaceholder: "Example: 999.99",
      subtractTip: "Tip: Use - to subtract, example -25.",

      userActions: "User Actions",
      withdrawalStatus: "Withdrawal Status",
      frozen: "FROZEN",
      active: "ACTIVE",
      since: "Since",
      totalDeposit: "Total Deposit",
      totalWithdrawal: "Total Withdrawal",

      vipRanking: "VIP Ranking",
      rank: "Rank",
      saveVip: "Save VIP",

      withdrawalPin: "Withdrawal PIN",
      locked: "Locked",
      attemptsLeft: "Attempts left",
      failed: "Failed",
      yes: "YES",
      no: "NO",

      accountActions: "Account Actions",
      resetWithdrawalPin: "Reset Withdrawal PIN",
      resetAttemptsDesc: "Reset attempts back to 3",
      resetPassword: "Reset Password",
      resetPasswordDesc: "Set a new password for the user",
      resetPhoneNumber: "Reset Phone Number",
      updatePhoneNumber: "Update phone number",
      makeUser: "Make User",
      makeAdmin: "Make Admin",
      changeUserRole: "Change user role",

      growthCampaigns: "Growth & Campaigns",
      bonusOrder: "Bonus Order",
      bonusOrderDesc: "Assign a bonus order for user",
      luckyDraw: "Lucky Draw",
      luckyDrawDesc: "Assign a lucky draw trigger",
      bonusCredit: "Bonus Credit",
      bonusCreditDesc: "Credit bonus and view bonus history",

      riskControls: "Risk Controls",
      creditScore: "Credit Score",
      creditScoreDesc: "Below 95 will block withdrawal",
      restricted: "RESTRICTED",
      ok: "OK",
      saveScore: "Save Score",

      banUser: "Ban User",
      unbanUser: "Unban User",
      confirmBan: "Confirm Ban",
      confirmUnban: "Confirm Unban",
      banWarning: "This will block the user from logging in.",
      unbanWarning: "This will allow the user to log in again.",
      banReasonPlaceholder: "Example: Fraud / Abuse / Chargeback",
      allowLoginAgain: "Allow login again",
      blockUserLogin: "Block user from login",

      deleteUser: "Delete User",
      deleteUserDesc: "Permanent removal (danger)",
      deletePermanently: "Delete Permanently",
      deleteWarning: "This action is permanent and cannot be undone.",
      deleteInsteadPrefix: "If you only want to block the user, use",
      deleteInsteadSuffix: "instead.",

      createUserTitle: "Create User",
      createUserSubtitle: "Admin can create a user without invitation code",
      createUserButton: "Create User",
      phonePlaceholder: "Example: 60123456789",
      minimumPassword: "Minimum 6 characters",

      resetPin: "Reset PIN",
      newPinPlaceholder: "4-6 digits (example: 1234)",
      pinResetTip:
        "This will unlock withdrawals and reset failed attempts to 0.",

      updatePhone: "Update Phone",
      phoneUniqueTip:
        "This must be unique. If it already exists, backend will reject it.",

      passwordTip: "Tip: Send the new password to the user securely.",
    },

    withdrawals: {
      title: "Withdrawals",
      subtitle: "Admin withdrawals and recent withdrawal address records",

      withdrawals: "Withdrawals",
      recentWithdrawalAddresses: "Recent Withdrawal Addresses",
      loading: "Loading...",
      refresh: "Refresh",

      total: "Total",
      showing: "Showing",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      amount: "Amount",

      search: "Search",
      searchPlaceholder: "Search UID / phone / address / id / crypto...",
      cryptoType: "Crypto Type",
      statusServerFilter: "Status (server filter)",
      all: "All",
      allCaps: "ALL",
      pendingCaps: "PENDING",
      approvedCaps: "APPROVED",
      rejectedCaps: "REJECTED",
      minAmount: "Min Amount",
      maxAmount: "Max Amount",
      clearFilters: "Clear filters",

      page: "Page",
      date: "Date",
      user: "User",
      balance: "Balance",
      crypto: "Crypto",
      address: "Address",
      status: "Status",
      actions: "Actions",
      unknown: "Unknown",
      note: "Note",
      approve: "Approve",
      reject: "Reject",
      edit: "Edit",
      delete: "Delete",

      first: "First",
      prev: "Prev",
      next: "Next",
      last: "Last",
      of: "of",

      totalRecords: "Total Records",
      recentAddressRecords: "Recent withdrawal address records",
      lastUsed: "Last Used",

      noWithdrawalsFound: "No withdrawals found.",
      noRecentAddressesFound: "No recent withdrawal address records found.",

      close: "Close",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",

      editRecentAddress: "Edit Recent Withdrawal Address",
      editRecentAddressDesc: "Update the saved wallet address and crypto type.",
      walletAddress: "Wallet address",

      cryptoWithdrawalAddress: "Crypto withdrawal address",
      scanOrCopy: "Scan or copy wallet address",
      verifyBeforeApprove:
        "Verify the network and wallet address before approving this withdrawal.",
      network: "Network",
      userUid: "User UID",
      liveRate: "Live rate",
      loadingRate: "Loading rate...",
      estimated: "Estimated",
      updated: "Updated",
      copy: "Copy",
      copyAddress: "Copy address",
      viewQrCopyAddress: "View QR and copy address",

      confirmApprove: "Approve this withdrawal?",
      confirmReject: "Reject this withdrawal and return balance?",
      rejectReasonPrompt: "Reject reason? (optional)",
      confirmDeleteRecentAddress:
        "Delete this recent withdrawal address record?",

      failedLoadWithdrawals: "Failed to load withdrawals",
      failedLoadRecentAddresses: "Failed to load recent addresses",
      approveFailed: "Approve failed",
      rejectFailed: "Reject failed",
      deleteFailed: "Delete failed",
      updateFailed: "Update failed",

      approvedSuccess: "Withdrawal approved",
      rejectedSuccess: "Withdrawal rejected",
      recentAddressUpdated: "Recent address updated",
      recentAddressDeleted: "Recent address deleted",

      copied: "Copied",
      copyFailed: "Copy failed",

      noWalletAddress: "No wallet address found",
      addressMinLength: "Address must be at least 8 characters",

      coinGeckoFailed: "CoinGecko price API failed",
      incompleteRates: "CoinGecko returned incomplete EUR crypto rates",
      unableLoadRates: "Unable to load live crypto rates from CoinGecko",
      rateUnavailable: "Rate unavailable",
    },

    deposits: {
      title: "Deposits",
      subtitle: "Latest on top • 10 per page • Admin-added balance records",

      deposits: "Deposits",
      loading: "Loading...",
      refresh: "Refresh",

      total: "Total",
      today: "Today",
      showing: "Showing",
      amount: "Amount",
      of: "of",
      page: "Page",
      totalPages: "total pages",

      search: "Search",
      searchPlaceholder: "Search UID / deposit id / type / note...",
      apply: "Apply",
      clearFilters: "Clear filters",

      date: "Date",
      type: "Type",
      user: "User",
      before: "Before",
      after: "After",
      note: "Note",
      unknown: "Unknown",

      noDepositsFound: "No deposits found.",

      first: "First",
      prev: "Prev",
      next: "Next",
      last: "Last",

      failedLoad: "Failed to load deposits",
    },

    trialBonus: {
      title: "Trial Bonus",

      grantAnyUserTitle: "Grant Trial Bonus To Any User",
      searchAnyUserLabel: "Search any user by UID / phone / user ID",
      typeAtLeastTwo: "Type at least 2 characters...",

      uid: "UID",
      phone: "Phone",
      userId: "User ID",
      action: "Action",
      actions: "Actions",

      loadingUsers: "Loading users...",
      noUsersFound: "No users found.",
      grantTrial: "Grant Trial",

      recordsTitle: "Trial Bonus Records",
      recordsSubtitle:
        "Paginated table of users who already have trial bonus records.",
      searchTrialRecordsLabel: "Search trial records by UID / phone",
      searchTrialRecordsPlaceholder: "Search UID / phone...",

      loading: "Loading...",
      refresh: "Refresh",
      totalTrialUsers: "total trial users",

      trialStatus: "Trial Status",
      credited: "Credited",
      reversed: "Reversed",
      remaining: "Remaining",
      lastCredit: "Last Credit",
      lastReversal: "Last Reversal",

      active: "Active",
      revoked: "Revoked",
      none: "None",

      loadingTrialUsers: "Loading trial users...",
      noTrialUsersFound: "No trial users found.",

      grant: "Grant",
      revoke: "Revoke",

      showing: "Showing",
      to: "to",
      of: "of",
      rows: "rows",
      perPage: "Per page",
      prev: "Prev",
      next: "Next",
      page: "Page",

      grantTrialBonus: "Grant Trial Bonus",
      revokeTrialBonus: "Revoke Trial Bonus",
      cancel: "Cancel",
      amount: "Amount",
      note: "Note",
      amountPlaceholder: "e.g. 300",
      defaultGrantNote: "Trial bonus",

      grantPreventDuplicate:
        "Backend prevents granting trial twice for the same user.",
      revokeRemaining: "Revoke Remaining",
      revokeOnlyRemaining:
        "This revokes only the remaining trial credit and does not touch earned balance.",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",
      failedLoadTrialUsers: "Failed to load trial users",
      failedLoadUsers: "Failed to load users",
      amountGreaterThanZero: "Amount must be greater than 0",
      grantedSuccess: "Trial bonus granted",
      failedGrant: "Failed to grant trial bonus",
      revokedSuccess: "Trial bonus revoked",
      failedRevoke: "Failed to revoke trial bonus",
    },

    bonusCredit: {
      title: "Bonus Credit",
      subtitle:
        "Default shows all users bonus history. Search a UID to credit a specific user.",

      backToUsers: "Back to Users",
      refresh: "Refresh",

      searchUserByUid: "Search User by UID",
      uidPlaceholder: "Example: 100008",
      searching: "Searching...",
      searchUser: "Search User",
      clear: "Clear",

      userDetails: "User Details",
      noUserSelected: "No user selected. History below is showing all users.",
      currentBalance: "Current Balance",

      creditBonus: "Credit Bonus",
      amount: "Amount",
      amountPlaceholder: "Example: 100",
      note: "Note",
      notePlaceholder: "Example: Welcome bonus / Promotion / Compensation",
      crediting: "Crediting...",

      historyTitle: "Bonus Credit History",
      searchNotePlaceholder: "Search note...",
      search: "Search",

      created: "Created",
      type: "Type",
      before: "Before",
      after: "After",

      loadingHistory: "Loading history...",
      noHistoryFound: "No bonus history found.",

      showing: "Showing",
      to: "to",
      of: "of",
      prev: "Prev",
      next: "Next",
      page: "Page",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",
      failedLoadHistory: "Failed to load bonus history",
      searchSelectUserFirst: "Search and select a user by UID first",
      validBonusAmount: "Enter a valid bonus amount",
      creditedSuccess: "Bonus credited successfully",
      failedCreditBonus: "Failed to credit bonus",
    },

    referralUsers: {
      title: "Referral Users",
      subtitle:
        "View user referral codes, who referred them, and registration dates",

      searchPlaceholder: "Search phone / referral code / referred by...",
      allUsers: "All users",
      hasReferrer: "Has referrer",
      noReferrer: "No referrer",
      newest: "Newest",
      oldest: "Oldest",
      refresh: "Refresh",

      totalUsers: "Total Users",
      topReferrerThisWeek: "Top Referrer This Week",
      code: "Code",
      referral: "referral",
      referrals: "referrals",
      noReferralsThisWeek: "No referrals this week",

      phoneNumber: "Phone Number",
      referralCode: "Referral Code",
      referredBy: "Referred By",
      referralCount: "Referral Count",
      createdDate: "Created Date",

      loadingUsers: "Loading users...",
      noUsersFound: "No users found.",

      showing: "Showing",
      of: "of",
      prev: "Prev",
      next: "Next",
      page: "Page",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",
      failedLoadUsers: "Failed to load users",
    },

    luckyDraw: {
      title: "Lucky Draw Trigger Settings",

      assignTitle: "Assign Lucky Draw Trigger",
      assignSubtitle:
        "Set a trigger count and one fixed reward. User chooses 1 egg visually, but reward is the one you set here.",
      uidPlaceholder: "Paste UID here...",
      userCurrentOrder: "User current order",
      triggerOrderCount: "Trigger Order Count",
      popupTitle: "Popup Title",
      popupDescription: "Popup Description",
      descriptionPlaceholder: "Pick 1 diamond and win your reward",

      rewardType: "Reward Type",
      cashReward: "Cash Reward",
      bonusOrder: "Bonus Order",
      cashAmount: "Cash Amount",
      cashAmountPlaceholder: "Enter cash amount",
      selectBonusOrder: "Select Bonus Order",
      clickChooseOrder: "Click to choose an order...",
      price: "Price",

      bonusOrderCommissionRate: "Bonus Order Commission Rate",
      ratePlaceholder: "Leave empty = use global rate, e.g. 0.15 = 15%",
      decimalFormatTip:
        "Use decimal format. Example: 0.15 = 15%, 0.10 = 10%, 0.05 = 5%.",

      saving: "Saving...",
      saveRule: "Save Lucky Draw Rule",

      savedRules: "Saved Lucky Draw Rules",
      savedRulesSubtitle: "Shows the fixed reward rule for each trigger count.",
      refresh: "Refresh",
      loadingRules: "Loading lucky draw rules...",
      noRules: "No lucky draw rules saved for this user.",

      triggerAtOrder: "Trigger at order",
      reward: "Reward",
      cash: "Cash",
      unknownOrder: "Unknown order",
      rate: "Rate",
      globalRate: "Global rate",
      rule: "Rule",
      on: "ON",
      off: "OFF",
      claimed: "Claimed",
      yes: "YES",
      no: "NO",
      pickedEgg: "Picked Egg",
      ruleTitle: "Title",
      claimedAt: "Claimed at",
      notClaimedYet: "Not claimed yet",

      activeStatus: "ACTIVE",
      claimedStatus: "CLAIMED",
      disabledStatus: "DISABLED",

      disable: "Disable",
      delete: "Delete",
      cancel: "Cancel",
      deleting: "Deleting...",
      disabling: "Disabling...",

      drawerSubtitle:
        "Filter by price range + search. Only active pool orders are shown.",
      searchNameNumber: "Search name / number...",
      minPrice: "Min price",
      maxPrice: "Max price",
      showingFirst100:
        "Showing first 100 of {{count}} matching orders. Use search or price range to narrow results.",
      noActivePoolOrders: "No active pool orders found.",

      deleteRuleTitle: "Delete Lucky Draw Rule",
      disableRuleTitle: "Disable Lucky Draw Rule",
      deleteRuleSubtitle: "This will permanently remove the lucky draw rule.",
      disableRuleSubtitle:
        "This will turn off the lucky draw rule so it can no longer be triggered.",
      deletePermanentWarning: "This action is permanent and cannot be undone.",
      disableHistoryWarning:
        "The rule will remain in history, but it will no longer trigger.",

      fillRequired: "Please fill in UID, trigger count, and reward type.",
      validCashAmount: "Please enter a valid cash amount.",
      chooseBonusOrder: "Please choose a bonus order.",
      rateNumberAboveZero: "Bonus commission rate must be a number 0 or above.",
      useDecimalFormat: "Use decimal format. Example: 0.15 = 15%.",

      ruleSaved: "Lucky draw rule saved",
      failedSaveRule: "Failed to save lucky draw rule",
      serverErrorSaving: "Server error saving lucky draw rule.",
      failedFetchRules: "Failed to fetch lucky draw rules",
      failedDisableRule: "Failed to disable lucky draw rule",
      failedDeleteRule: "Failed to delete lucky draw rule",
      ruleDisabled: "Lucky draw rule disabled",
      ruleDeleted: "Lucky draw rule deleted",
    },

    bonusTriggers: {
      title: "Bonus Order Trigger Settings",

      assignTitle: "Assign Bonus Trigger",
      assignSubtitle:
        "Coming from More Modal will auto-fill UID, but you can edit it.",
      uidPlaceholder: "Paste UID here...",
      userCurrentOrder: "User current order",
      triggerOrderCount: "Trigger Order Count",
      selectPoolOrder: "Select Pool Order",
      clickChooseOrder: "Click to choose an order...",
      price: "Price",

      overrideDefaultCommission: "Override default bonus commission %",
      customCommissionRate: "Custom Commission Rate",
      customRatePlaceholder: "Example: 0.10 = 10%",
      decimalTip: "Stored as decimal. Example: 0.10 = 10%",
      saving: "Saving...",
      saveTrigger: "Save Bonus Trigger",

      savedBonusOrders: "Saved Bonus Orders",
      savedSubtitle:
        "Shows whether user has triggered it, or if it is pending/completed.",
      refresh: "Refresh",
      loadingBonusList: "Loading bonus list...",
      noBonusTriggers: "No bonus triggers saved for this user.",

      unknownOrder: "Unknown order",
      triggerAt: "Trigger at",
      commission: "Commission",
      custom: "Custom",
      global: "Global",
      rule: "Rule",
      on: "ON",
      off: "OFF",

      activeStatus: "ACTIVE",
      inactiveStatus: "INACTIVE",
      pendingStatus: "PENDING",
      completedStatus: "COMPLETED",

      disable: "Disable",
      delete: "Delete",
      cancel: "Cancel",
      close: "Close",
      processing: "Processing...",

      selectBonusOrder: "Select Bonus Order",
      drawerSubtitle:
        "Filter by price range + search. Only active pool orders are shown.",
      searchNameNumber: "Search name / number...",
      minPrice: "Min price",
      maxPrice: "Max price",
      showingFirst100:
        "Showing first 100 of {{count}} matching orders. Use search or price range to narrow results.",
      noMatchingOrders: "No matching orders.",

      deleteRuleTitle: "Delete Bonus Rule",
      disableRuleTitle: "Disable Bonus Rule",
      deleteRuleMessage: "This will permanently delete this bonus rule.",
      disableRuleMessage:
        "This will turn off this bonus rule so it can no longer trigger.",

      fillAllFields: "Please fill in all fields.",
      validCustomRate: "Please enter a valid custom commission rate.",
      useDecimalFormat: "Use decimal format. Example: 0.15 = 15%.",

      savedSuccess: "Bonus trigger saved",
      failedSave: "Failed to save bonus trigger",
      serverErrorSaving: "Server error saving bonus trigger.",
      failedFetchBonusList: "Failed to fetch bonus list",
      failedDisable: "Failed to disable bonus rule",
      failedDelete: "Failed to delete bonus rule",
      disabledSuccess: "Bonus rule disabled",
      deletedSuccess: "Bonus rule deleted",
    },

    orderList: {
      title: "Admin Order List",
      subtitle:
        "View a specific user’s order history with server pagination and status filters",

      back: "Back",
      refresh: "Refresh",
      refreshing: "Refreshing...",
      loading: "Loading...",

      filters: "Filters",
      pasteUid: "Paste UID",
      status: "Status",
      allStatuses: "All statuses",
      pendingCaps: "PENDING",
      completedCaps: "COMPLETED",
      searchLoadedRows: "Search loaded rows",
      searchPlaceholder: "Order no / name / status",
      perPage: "Per page",
      loadOrders: "Load Orders",
      clear: "Clear",

      pickedUser: "Picked User",
      phone: "Phone",

      loadedOrders: "Loaded Orders",
      pending: "Pending",
      completed: "Completed",
      bonusOrders: "Bonus Orders",
      totalPrice: "Total Price",
      totalCommission: "Total Commission",

      orders: "Orders",
      orderNumber: "Order #",
      orderName: "Order Name",
      price: "Price",
      commission: "Commission",
      bonus: "Bonus",
      created: "Created",
      poolOrderId: "Pool Order ID",
      orderId: "Order ID",

      yes: "YES",
      no: "NO",

      loadingOrders: "Loading orders...",
      noOrdersFound: "No orders found for this user / filter.",
      enterUserLoadOrders: "Enter a user ID and load orders.",

      showing: "Showing",
      localRows: "local rows",
      serverTotal: "Server total",
      page: "Page",
      prev: "Prev",
      next: "Next",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",
      enterUserIdFirst: "Enter a user ID first",
      failedLoad: "Failed to load order list",
    },

    popups: {
      popupManagement: "Popup Management",
      userNotifications: "User Notifications",
      communicationCenter: "Admin Communication Center",

      popupDescription:
        "Create platform-wide announcement popups, target everyone or selected users.",
      notificationDescription:
        "Create user notifications that appear inside the user front end notification area.",

      popup: "Popup",
      notification: "Notification",
      refresh: "Refresh",
      newPopup: "+ New Popup",
      newNotification: "+ New Notification",

      searchPopups: "Search popups...",
      searchNotifications: "Search notifications...",

      popups: "Popups",
      notifications: "Notifications",
      popupControlCenter: "Popup modal control center",
      notificationControlCenter: "User notification control center",

      title: "Title",
      message: "Message",
      description: "Description",
      target: "Target",
      users: "Users",
      status: "Status",
      created: "Created",
      actions: "Actions",

      specificUsers: "Specific users",
      specificUser: "Specific user",
      allUsers: "All users",
      everyone: "Everyone",
      selected: "Selected",
      selectedLower: "selected",
      select: "Select",

      active: "Active",
      inactive: "Inactive",
      disabled: "Disabled",
      edit: "Edit",
      activate: "Activate",
      deactivate: "Deactivate",
      delete: "Delete",
      disable: "Disable",

      loadingPopups: "Loading popups...",
      loadingNotifications: "Loading notifications...",
      noPopupsFound: "No popups found.",
      noNotificationsFound: "No notifications found.",

      createNotification: "Create Notification",
      createPopup: "Create Popup",
      editPopup: "Edit Popup",
      createNotificationSubtitle:
        "Send a notification to all users or one specific user",
      createPopupSubtitle: "Create a global popup for users",
      editingPopup: "Editing popup {{id}}",

      cancel: "Cancel",
      creating: "Creating...",
      saving: "Saving...",
      saveChanges: "Save Changes",

      notificationContent: "Notification Content",
      popupContent: "Popup Content",
      audience: "Audience",

      notificationTitlePlaceholder: "Example: Deposit Successful",
      notificationDescriptionPlaceholder:
        "Write the notification description here...",
      popupTitlePlaceholder: "Example: Important Security Notice",
      popupMessagePlaceholder: "Write the popup message here...",

      sendNotificationEveryone: "Send this notification to everyone",
      sendNotificationOneUser: "Send this notification to one user",
      showPopupEveryone: "Show this popup to every user",
      pickPopupSpecific: "Pick exactly who should see this popup",

      searchUsers: "Search users",
      searchUsersPlaceholder: "Search phone / UID / user id...",
      searchUidPhone: "Search UID / phone...",
      pickUsers: "Pick users",
      pickUser: "Pick user",
      noUsersFound: "No users found",
      selectedUserIds: "Selected user ids",
      selectedUser: "Selected user",
      selectedUsers: "Selected users",
      noUserSelected: "No user selected",
      noUsersSelected: "No users selected",
      total: "Total",
      phone: "Phone",
      remove: "Remove",

      usersCanReceive: "Users can receive this popup now",
      savedButHidden: "Saved, but hidden until activated",
      on: "ON",
      off: "OFF",

      quickTips: "Quick Tips",
      notificationTip1: "Notifications are shown inside the user front end",
      notificationTip2: "Use all users for platform-wide messages",
      notificationTip3: "Use specific user for manual account messages",
      notificationTip4: "Keep the title short and the description clear",
      popupTip1: "Best titles are short and direct",
      popupTip2: "Keep message under 5 short lines if possible",
      popupTip3: "Use specific users for manual targeting",
      popupTip4: "Use inactive if you want to save first and publish later",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",
      failedLoadPage: "Failed to load page",

      titleRequired: "Title is required",
      messageRequired: "Message is required",
      pickAtLeastOneUser: "Pick at least 1 user",
      notificationTitleRequired: "Notification title is required",
      notificationDescriptionRequired: "Notification description is required",
      pickUserNotification: "Pick a user for this notification",

      popupCreated: "Popup created",
      popupUpdated: "Popup updated",
      popupActivated: "Popup activated",
      popupDeactivated: "Popup deactivated",
      popupDeleted: "Popup deleted",
      notificationCreated: "Notification created",
      notificationDisabled: "Notification disabled",

      failedSavePopup: "Failed to save popup",
      failedUpdatePopup: "Failed to update popup",
      failedDeletePopup: "Failed to delete popup",
      failedCreateNotification: "Failed to create notification",
      failedDisableNotification: "Failed to disable notification",

      confirmDeletePopup: 'Delete popup "{{title}}"?',
      confirmDisableNotification: 'Disable notification "{{title}}"?',
    },

    orderPool: {
      title: "Order Pool Settings",

      addHotelOrder: "Add Hotel Order",
      addHotelOrderDesc:
        "Create orders that users will randomly receive in Search Hotel.",
      total: "Total",
      active: "Active",
      inactive: "Inactive",

      orderNumberPlaceholder: "Order Number (unique)",
      hotelNamePlaceholder: "Hotel Name",
      price: "Price",
      imageKeyOptional: "Image Key (optional)",
      fallbackImageUrlOptional: "Fallback Image URL (optional)",
      adding: "Adding...",
      addOrder: "Add Order",

      bulkAdd: "Bulk Add",
      bulkFormat: "Format:",
      bulkFormatExample: "CodeNumber, Hotelname, Price, ImageKey",
      importing: "Importing...",
      importBulkOrders: "Import Bulk Orders",
      clear: "Clear",

      imageKeys: "Image Keys",
      imageKeysDesc: "One key controls many orders. Example:",
      imageKeysExample: "Hotel → one image URL",
      keys: "Keys",
      keyPlaceholder: "Key (example: jwmarriott)",
      key: "Key",
      imageUrl: "Image URL",
      saving: "Saving...",
      save: "Save",
      addImageKey: "Add Image Key",
      searchImageKeys: "Search image keys by key, url or active...",
      perPage: "Per page",
      showing: "Showing",
      of: "of",
      yes: "Yes",
      no: "No",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      noImage: "No Image",
      noImageKeysFound: "No image keys found.",

      sort: "Sort",
      none: "None",
      priceLowHigh: "Price: Low → High",
      priceHighLow: "Price: High → Low",
      searchOrders: "Search by order name, number, key or url...",
      toggle: "Toggle",
      noOrdersFound: "No orders found.",

      prev: "Prev",
      next: "Next",
      page: "Page",

      editHotelOrder: "Edit Hotel Order",
      editHotelOrderDesc: "Update order details, key and fallback image",
      orderNumber: "Order Number",
      orderName: "Order Name",
      imageKey: "Image Key",
      fallbackImageUrl: "Fallback Image URL",
      saveChanges: "Save Changes",

      imageKeyPreview: "Image key preview",
      hotelPreview: "Hotel preview",

      failedLoadOrders: "Failed to load orders",
      failedLoadImageKeys: "Failed to load image keys",
      orderCreated: "Order created",
      failedCreateOrder: "Failed to create order",
      failedUpdateOrderStatus: "Failed to update order status",
      orderStatusUpdated: "Order status updated",
      failedUpdateOrder: "Failed to update order",
      orderUpdated: "Order updated",
      confirmDeleteOrder: "Delete this hotel order permanently?",
      failedDeleteOrder: "Failed to delete order",
      orderDeleted: "Order deleted",

      bulkMissingFields: 'Line {{line}}: Missing fields → "{{raw}}"',
      bulkInvalidPrice: 'Line {{line}}: Invalid price → "{{raw}}"',
      nothingValidImport: "Nothing valid to import.",
      imported: "✅ Imported",
      failed: "❌ Failed",
      skippedLines: "⚠️ Skipped Lines",
      failedOrders: "❌ Failed Orders",
      networkError: "Network error",
      importedOrders: "Imported {{count}} order(s)",
      someBulkFailed: "Some bulk orders failed",

      failedCreateImageKey: "Failed to create image key",
      imageKeyCreated: "Image key created",
      failedUpdateImageKey: "Failed to update image key",
      imageKeyUpdated: "Image key updated",
      confirmDeleteImageKey: "Delete this image key?",
      failedDeleteImageKey: "Failed to delete image key",
      imageKeyDeleted: "Image key deleted",
    },

    signinRewards: {
      title: "Sign-in Rewards",
      subtitle:
        "View who claimed sign-in rewards and manage reward prices (Day 1 → Day 6)",

      searchPlaceholder: "Search phone / userId / date...",
      refresh: "Refresh",

      rewardPrices: "Sign-in Reward Prices",
      rewardPricesDesc:
        "Edit Day 1 → Day 6 prices. These values are used when users claim.",
      reload: "Reload",
      savePrices: "Save Prices",
      day: "Day",
      dayOneTip: "Tip: Set Day 2–Day 6 to 0 if you only want Day 1 reward.",

      totalClaims: "Total Claims",
      uniqueUsers: "Unique Users",
      totalRewardAmount: "Total Reward Amount",

      filterUserId: "Filter User ID",
      optionalUserId: "Optional userId...",
      fromDate: "From (ET date)",
      toDate: "To (ET date)",
      apply: "Apply",
      filtersUseEt: "Filters use Eastern Time date string",
      clear: "Clear",

      claims: "Claims",
      user: "User UID",
      etDate: "ET Date",
      streakDay: "Streak Day",
      reward: "Reward",
      ordersCompleted: "Orders Completed",
      createdAt: "Created At",

      loadingClaims: "Loading claims...",
      noClaimsFound: "No claims found.",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",

      loadedClaims: "Loaded sign-in reward claims",
      failedLoadClaims: "Failed to load sign-in claims",
      loadedRewardPrices: "Loaded reward prices",
      failedLoadRewardConfig: "Failed to load reward config",
      rewardPricesUpdated: "Reward prices updated successfully",
      failedUpdateRewardPrices: "Failed to update reward prices",
    },

    settings: {
      title: "Settings • VIP & Bonus",
      vipBonusSettings: "VIP & Bonus Settings",

      safetyNoticeTitle: "Dashboard Safety Notice",
      safetyNoticeDesc:
        "This controls the security reminder shown on the user dashboard. When you save changes, the notice version increases and users will see it again.",
      enableSafetyNotice: "Enable safety notice",
      noticeLabel: "Label",
      noticeLabelPlaceholder: "Security reminder",
      noticeVersion: "Version",
      currentVersion: "Current version: v{{version}}",
      noticeTitleInput: "Title",
      noticeTitlePlaceholder: "Stay alert for fake recruitment pages",
      noticeDescriptionInput: "Description",
      noticeDescriptionPlaceholder: "Only use the official platform...",
      saveSafetyNotice: "Save Safety Notice",
      failedLoadSafetyNotice: "Failed to load safety notice",
      failedSaveSafetyNotice: "Failed to save safety notice",
      safetyNoticeSaved: "Safety notice saved",
      safetyNoticeTitleRequired: "Safety notice title is required",
      safetyNoticeDescriptionRequired: "Safety notice description is required",

      description:
        "Set the global bonus order commission rate and the normal order commission rate for each VIP rank.",
      example: "Example: 0.01 = 1%, 0.1 = 10%",

      bonusOrderCommissionRate: "Bonus Order Commission Rate",
      bonusOrderCommissionRateDesc:
        "Global rate used when order is marked as bonus",

      rank: "Rank",
      ordersLimit: "Orders Limit",
      normalCommissionRate: "Normal Commission Rate",

      refresh: "Refresh",
      saving: "Saving...",
      saveSettings: "Save Settings",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",

      failedLoadVipConfig: "Failed to load VIP config",
      failedSaveVipConfig: "Failed to save VIP config",
      savedSuccess: "VIP and bonus settings saved",

      bonusRateValidation:
        "bonusCommissionRate must be between 0 and 1 (example 0.1)",
      rankValidation: "Rank must be 1, 2, or 3",
      ordersLimitValidation: "Rank {{rank}}: ordersLimit must be >= 1",
      commissionRateValidation:
        "Rank {{rank}}: commissionRate must be between 0 and 1",
    },

    content: {
      title: "Content Management",
      subtitle:
        "Manage Terms, Privacy & Security, and Platform Rules content for the user settings pages.",

      termsConditions: "Terms & Conditions",
      privacySecurity: "Privacy & Security",
      platformRules: "Platform Rules",

      loadingContent: "Loading content...",

      pageTitle: "Title",
      pageTitlePlaceholder: "Enter page title",
      version: "Version",
      lastUpdated: "Last Updated",
      published: "Published",
      hidden: "Hidden",
      publishedDesc: "If turned off, public page will not return this content",

      summary: "Summary",
      summaryPlaceholder: "Short page summary",

      sections: "Sections",
      addSection: "+ Add Section",
      section: "Section",
      remove: "Remove",
      heading: "Heading",
      headingPlaceholder: "Example: 1. Acceptance of Terms",
      paragraphs: "Paragraphs",
      paragraphsDesc: "Separate paragraphs with one empty line",
      paragraphsPlaceholder: "First paragraph...\n\nSecond paragraph...",

      refresh: "Refresh",
      saving: "Saving...",
      saveContent: "Save Content",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",
      failedLoadContent: "Failed to load content",
      titleRequired: "Title is required.",
      contentSaved: "Content saved successfully",
      failedSaveContent: "Failed to save content",
    },

    events: {
      title: "Events",
      subtitle:
        "Manage event banners, titles, and descriptions for the user events page.",

      searchPlaceholder: "Search event name / description / id...",
      refresh: "Refresh",
      addEvent: "+ Add Event",

      events: "Events",
      preview: "Preview",
      event: "Event",
      description: "Description",
      actions: "Actions",

      loadingEvents: "Loading events...",
      noEventsFound: "No events found.",

      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      create: "Create",
      saving: "Saving...",
      deleting: "Deleting...",
      saveChanges: "Save Changes",

      addEventTitle: "Add Event",
      createEventSubtitle: "Create a new event",
      editEventTitle: "Edit Event",
      deleteEventTitle: "Delete Event",
      eventId: "Event ID",
      untitled: "Untitled",

      eventName: "Event Name",
      eventNamePlaceholder: "Example: New Year Promotion",
      uploadImage: "Upload Image",
      uploadNewImage: "Upload New Image",
      uploadImageDesc:
        "Choose from your computer. Optional fallback below: manual image URL.",
      uploadNewImageDesc:
        "Leave empty to keep current image, or use manual image URL below.",
      imageUrl: "Image URL",
      imageUrlOptional: "Image URL (optional)",
      descriptionPlaceholder: "Write event description...",

      deletePermanentWarning: "This action is permanent and cannot be undone.",
      deleteEventDesc:
        "Make sure you really want to remove this event from the user page.",

      pleaseLoginAgain: "Please login again.",
      nonJson: "Server returned non-JSON response.",
      requestFailed: "Request failed",

      failedLoadEvents: "Failed to load events",
      fillRequired:
        "Please fill in name, description, and select an image or image URL.",
      eventCreated: "Event created",
      failedCreateEvent: "Failed to create event",
      eventUpdated: "Event updated",
      failedUpdateEvent: "Failed to update event",
      eventDeleted: "Event deleted",
      failedDeleteEvent: "Failed to delete event",
    },
  },

  zh: {
    brand: "曼达【MANTAP】集团",

    nav: {
      dashboard: "仪表盘",
      users: "用户管理",
      kyc: "身份认证",
      withdrawals: "提现管理",
      deposits: "充值管理",
      orderList: "订单列表",
      trialBonus: "体验金",
      guestEmails: "访客邮件",
      bonusCredit: "彩金加款",
      invitationCodes: "邀请码",
      luckyDraw: "幸运抽奖",
      bonusTriggers: "奖励触发",
      popups: "弹窗管理",
      orderPool: "订单池",
      signinRewards: "签到奖励",
      settings: "设置",
      content: "内容管理",
      events: "活动管理",
      page: "页面",
    },

    common: {
      logout: "退出登录",
      lightMode: "浅色模式",
      darkMode: "深色模式",
      refresh: "刷新",
      readAll: "全部已读",
      close: "关闭",
      dragToMoveTab: "拖动标签",
      language: "语言",
      english: "English",
      chinese: "中文",
    },

    notifications: {
      title: "通知",
      unread: "未读",
      youHaveUnread: "你有 {{count}} 条未读通知",
      loading: "正在加载通知...",
      empty: "暂无通知。",
      fallbackTitle: "通知",
      failedLoad: "加载通知失败",
      failedMarkRead: "标记通知已读失败",
      failedMarkAllRead: "全部标记已读失败",
      user: "用户",
      unknown: "未知",
      matched: "匹配",
    },

    dashboard: {
      title: "仪表盘",
      overview: "仪表盘总览",

      refreshData: "刷新数据",
      refreshing: "正在刷新...",

      totalUsers: "用户总数",
      admins: "管理员",
      banned: "封禁",
      bannedUsers: "封禁用户",
      availableUsers: "可用用户",

      pendingWithdrawals: "待处理提现",
      pendingWithdraw: "待处理提现",
      pendingAmount: "待处理金额",

      depositQty: "充值数量",
      withdrawalQty: "提现数量",
      depositRangeSub: "所选日期范围内的充值记录",
      withdrawalRangeSub: "所选日期范围内的提现记录",

      rangePerformance: "范围表现 $",
      liveSummary: "实时汇总",
      deposits: "充值",
      withdrawals: "提现",

      coreAccountHealth: "账户核心状态",
      realTime: "实时",
      viewFullDetails: "查看完整详情",

      rangeSummary: "充值与提现范围汇总",
      rangeFilterDesc: "按本地电脑时间筛选记录",
      resetToday: "重置为今天",
      startDateTime: "开始日期与时间",
      endDateTime: "结束日期与时间",
      rangeStart: "范围开始",
      rangeEnd: "范围结束",
      invalidRange: "开始日期/时间不能晚于结束日期/时间。",

      depositAmount: "充值金额",
      withdrawalAmount: "提现金额",
      depositRecords: "充值记录",
      withdrawalRecords: "提现记录",

      userManagement: "用户管理",
      userManagementDesc: "管理余额、角色、轮次、封禁和账户控制设置。",
      withdrawalsDesc: "审核待处理请求，并快速进行批准或拒绝操作。",

      recentWithdrawals: "最近提现",
      latestWithdrawals: "最新 5 条提现记录",
      viewAll: "查看全部",
      noWithdrawals: "暂无提现记录。",

      date: "日期",
      user: "用户",
      amount: "金额",
      status: "状态",
      unknown: "未知",

      failedLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      failedLoad: "仪表盘加载失败",
      requestFailed: "请求失败",
    },

    adminKyc: {
      title: "KYC认证",
      subtitle: "审核身份认证提交资料，并批准或拒绝用户。",
      searchPlaceholder: "搜索姓名、UID、电话、证件...",
      allStatus: "全部状态",
      pending: "待审核",
      approved: "已批准",
      rejected: "已拒绝",
      refresh: "刷新",
      submissions: "KYC提交记录",
      action: "操作",
      user: "用户",
      phone: "电话",
      fullName: "姓名",
      document: "证件",
      documentType: "证件类型",
      documentNumber: "证件号码",
      status: "状态",
      submitted: "提交时间",
      submittedAt: "提交时间",
      reviewedAt: "审核时间",
      rejectionReason: "拒绝原因",
      noSubmissions: "未找到KYC提交记录。",
      view: "查看",
      reviewTitle: "KYC审核",
      close: "关闭",
      documentImages: "证件图片",
      clickImageHint: "点击图片可在新标签页打开。",
      frontDocument: "证件正面",
      backDocument: "证件背面",
      frontDocumentAlt: "证件正面",
      backDocumentAlt: "证件背面",
      noFrontImage: "未上传证件正面图片。",
      noBackImage: "未上传证件背面图片。",
      submittedDetails: "提交资料",
      detailsHint: "请检查提交信息是否与证件一致。",
      reviewDecision: "审核决定",
      reviewDecisionHint:
        "批准KYC后，等待中的提现将变为待处理。拒绝KYC后，等待中的提现将被拒绝并退回余额。",
      approveKyc: "批准KYC",
      rejectKyc: "拒绝KYC",
      rejectReasonPlaceholder: "输入拒绝原因...",
      currentStatus: "当前状态",

      nationalId: "身份证",
      passport: "护照",
      driversLicense: "驾驶证",

      pleaseLoginAgain: "请重新登录。",
      requestFailed: "请求失败",
      failedLoad: "加载KYC提交记录失败",
      confirmApprove: "确定批准此KYC认证吗？",
      confirmReject: "确定拒绝此KYC认证吗？",
      approvedToast: "KYC已批准",
      rejectedToast: "KYC已拒绝",
      failedApprove: "批准KYC失败",
      failedReject: "拒绝KYC失败",
      enterRejectReason: "请输入拒绝原因",
    },

    guestEmails: {
      title: "访客邮件",
      refresh: "刷新",
      sendEmail: "发送邮件",
      sendNow: "立即发送",
      sending: "发送中...",
      cancel: "取消",
      close: "关闭",
      view: "查看",
      historyTitle: "已发送邮件记录",
      showingRecords: "显示 {{shown}} / {{total}} 条记录",
      searchPlaceholder: "搜索邮箱、标题、描述...",
      guestRecipient: "访客收件人",
      emptyTitle: "暂无邮件记录",
      emptySubtitle: "点击发送邮件，创建第一封访客邮件。",

      stats: {
        totalEmails: "邮件总数",
        sent: "已发送",
        failed: "发送失败",
        today: "今日发送",
      },

      status: {
        sent: "已发送",
        failed: "失败",
        pending: "待处理",
      },

      table: {
        status: "状态",
        guestEmail: "访客邮箱",
        emailTitle: "标题",
        description: "描述",
        brevoId: "Brevo ID",
        sentAt: "发送时间",
        action: "操作",
      },

      modal: {
        sendTitle: "发送访客邮件",
        sendSubtitle: "使用 Brevo 模板创建带有自定义标题和内容的邮件。",
        footerHint: "此邮件将通过你的 Brevo 模板立即发送。",
      },

      form: {
        guestEmail: "访客邮箱",
        guestEmailPlaceholder: "guest@example.com",
        emailTitle: "邮件标题",
        emailTitlePlaceholder: "例如：欢迎来到我们的平台",
        description: "描述",
        descriptionPlaceholder: "在这里输入邮件内容...",
      },

      preview: {
        title: "实时预览",
        badge: "Brevo 模板",
        emptyTitle: "邮件标题将在这里显示",
        emptyDescription:
          "邮件描述将在这里显示。这部分内容会传入 Brevo 模板中的 {{ params.description }}。",
        recipient: "收件人",
      },

      details: {
        title: "邮件详情",
        subtitle: "查看完整标题、描述、收件人和发送状态。",
        status: "状态",
        recipient: "收件人",
        sentAt: "发送时间",
        emailTitle: "邮件标题",
        description: "描述",
        brevoMessageId: "Brevo 消息 ID",
      },

      success: {
        sent: "邮件发送成功",
      },

      errors: {
        loginAgain: "请重新登录。",
        nonJson: "服务器返回了非 JSON 响应。",
        requestFailed: "请求失败（{{status}}）",
        loadFailed: "加载邮件记录失败",
        sendFailed: "邮件发送失败",
        emailRequired: "访客邮箱不能为空",
        invalidEmail: "请输入有效的邮箱地址",
        titleRequired: "标题不能为空",
        titleTooLong: "标题不能超过 150 个字符",
        descriptionRequired: "描述不能为空",
        descriptionTooLong: "描述不能超过 5000 个字符",
      },
    },

    users: {
      title: "用户管理",
      subtitle: "管理用户、余额、角色和在线状态",

      searchPlaceholder: "搜索手机号 / UID / IP...",
      allRoles: "全部角色",
      user: "用户",
      admin: "管理员",
      refresh: "刷新",
      createUser: "+ 创建用户",

      sortUsers: "用户排序",
      sortNewest: "排序：最新",
      sortOldest: "排序：最旧",
      sortLastOnline: "排序：最近在线",
      sortHighestBalance: "排序：余额最高",
      sortLowestBalance: "排序：余额最低",
      sortMostOrders: "排序：订单最多",
      sortLeastOrders: "排序：订单最少",
      sortHighestPending: "排序：待处理最高",

      usersCount: "用户",
      actions: "操作",
      phone: "手机号",
      phoneNumber: "手机号",
      userId: "用户 ID",
      referrer: "推荐人",
      country: "国家",
      pending: "待处理",
      balance: "余额",
      addBalance: "加减余额",
      orders: "订单",
      orderControls: "订单控制",
      rounds: "轮次",
      registeredIp: "注册 IP",
      lastOnline: "最后在线",
      created: "创建时间",
      role: "角色",

      noUsersFound: "未找到用户。",
      more: "更多",
      banned: "已封禁",
      doubleClickCopyUid: "双击复制 UID",
      add: "添加",
      save: "保存",
      reset: "重置",
      cancel: "取消",
      close: "关闭",
      saving: "正在保存...",
      creating: "正在创建...",
      deleting: "正在删除...",

      showing: "显示",
      to: "到",
      of: "共",
      users: "个用户",
      perPage: "每页",
      prev: "上一页",
      next: "下一页",
      page: "页码",

      noUidToCopy: "没有 UID 可复制",
      uidCopied: "UID 已复制",
      failedCopyUid: "复制 UID 失败",
      failedLoadUsers: "加载用户失败",
      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",

      addSubtractBalance: "增加 / 减少余额",
      saveOrdersCompleted: "保存已完成订单数",
      saveTotalResetCount: "保存总轮次数",
      resetToZero: "重置为 0",

      userLabel: "用户",
      old: "旧",
      current: "当前",
      reason: "原因",
      reasonOptional: "原因（可选）",
      amount: "金额",
      mode: "模式",
      password: "密码",
      newPassword: "新密码",
      newPin: "新 PIN",
      newPhoneNumber: "新手机号",

      userNotFound: "未找到用户",

      freezeWithdrawal: "冻结提现",
      unfreezeWithdrawal: "解冻提现",
      confirmFreeze: "确认冻结",
      freezeWarning: "这将阻止该用户创建提现。",
      freezeReasonPlaceholder: "例如：风险审核 / 可疑活动 / 手动冻结",
      freezeWithdrawalDesc: "阻止该用户提现",
      unfreezeWithdrawalDesc: "允许该用户再次提现",

      editBalance: "编辑余额",
      addSubtract: "增加 / 减少",
      useNegative: "使用负数减少余额（例如：-50）",
      setBalance: "设置余额",
      replaceBalance: "将余额替换为指定金额",
      amountIncPlaceholder: "例如：100 或 -50",
      amountSetPlaceholder: "例如：999.99",
      subtractTip: "提示：使用 - 可减少余额，例如 -25。",

      userActions: "用户操作",
      withdrawalStatus: "提现状态",
      frozen: "已冻结",
      active: "正常",
      since: "开始时间",
      totalDeposit: "总充值",
      totalWithdrawal: "总提现",

      vipRanking: "VIP 等级",
      rank: "等级",
      saveVip: "保存 VIP",

      withdrawalPin: "提现 PIN",
      locked: "已锁定",
      attemptsLeft: "剩余尝试",
      failed: "失败次数",
      yes: "是",
      no: "否",

      accountActions: "账户操作",
      resetWithdrawalPin: "重置提现 PIN",
      resetAttemptsDesc: "将尝试次数重置回 3 次",
      resetPassword: "重置密码",
      resetPasswordDesc: "为用户设置新密码",
      resetPhoneNumber: "重置手机号",
      updatePhoneNumber: "更新手机号",
      makeUser: "设为普通用户",
      makeAdmin: "设为管理员",
      changeUserRole: "更改用户角色",

      growthCampaigns: "增长与活动",
      bonusOrder: "奖励订单",
      bonusOrderDesc: "为用户分配奖励订单",
      luckyDraw: "幸运抽奖",
      luckyDrawDesc: "分配幸运抽奖触发条件",
      bonusCredit: "彩金加款",
      bonusCreditDesc: "发放彩金并查看彩金记录",

      riskControls: "风控管理",
      creditScore: "信用分",
      creditScoreDesc: "低于 95 将禁止提现",
      restricted: "受限制",
      ok: "正常",
      saveScore: "保存分数",

      banUser: "封禁用户",
      unbanUser: "解除封禁",
      confirmBan: "确认封禁",
      confirmUnban: "确认解除",
      banWarning: "这将阻止该用户登录。",
      unbanWarning: "这将允许该用户再次登录。",
      banReasonPlaceholder: "例如：欺诈 / 滥用 / 拒付",
      allowLoginAgain: "允许再次登录",
      blockUserLogin: "阻止用户登录",

      deleteUser: "删除用户",
      deleteUserDesc: "永久删除（危险）",
      deletePermanently: "永久删除",
      deleteWarning: "此操作是永久性的，无法撤销。",
      deleteInsteadPrefix: "如果你只是想阻止该用户，请改用",
      deleteInsteadSuffix: "。",

      createUserTitle: "创建用户",
      createUserSubtitle: "管理员可以无需邀请码创建用户",
      createUserButton: "创建用户",
      phonePlaceholder: "例如：60123456789",
      minimumPassword: "至少 6 个字符",

      resetPin: "重置 PIN",
      newPinPlaceholder: "4-6 位数字（例如：1234）",
      pinResetTip: "这将解锁提现并将失败尝试次数重置为 0。",

      updatePhone: "更新手机号",
      phoneUniqueTip: "手机号必须唯一。如果已存在，后端会拒绝。",

      passwordTip: "提示：请用安全方式把新密码发送给用户。",
    },

    withdrawals: {
      title: "提现管理",
      subtitle: "管理提现申请和最近使用的钱包地址记录",

      withdrawals: "提现记录",
      recentWithdrawalAddresses: "最近提现地址",
      loading: "加载中...",
      refresh: "刷新",

      total: "总数",
      showing: "显示",
      pending: "待处理",
      approved: "已通过",
      rejected: "已拒绝",
      amount: "金额",

      search: "搜索",
      searchPlaceholder: "搜索 UID / 手机号 / 地址 / ID / 币种...",
      cryptoType: "币种类型",
      statusServerFilter: "状态（服务器筛选）",
      all: "全部",
      allCaps: "全部",
      pendingCaps: "待处理",
      approvedCaps: "已通过",
      rejectedCaps: "已拒绝",
      minAmount: "最小金额",
      maxAmount: "最大金额",
      clearFilters: "清除筛选",

      page: "页码",
      date: "日期",
      user: "用户",
      balance: "余额",
      crypto: "币种",
      address: "地址",
      status: "状态",
      actions: "操作",
      unknown: "未知",
      note: "备注",
      approve: "通过",
      reject: "拒绝",
      edit: "编辑",
      delete: "删除",

      first: "首页",
      prev: "上一页",
      next: "下一页",
      last: "末页",
      of: "共",

      totalRecords: "总记录",
      recentAddressRecords: "最近提现地址记录",
      lastUsed: "最后使用",

      noWithdrawalsFound: "未找到提现记录。",
      noRecentAddressesFound: "未找到最近提现地址记录。",

      close: "关闭",
      cancel: "取消",
      save: "保存",
      saving: "正在保存...",

      editRecentAddress: "编辑最近提现地址",
      editRecentAddressDesc: "更新已保存的钱包地址和币种类型。",
      walletAddress: "钱包地址",

      cryptoWithdrawalAddress: "加密货币提现地址",
      scanOrCopy: "扫描或复制钱包地址",
      verifyBeforeApprove: "批准提现前，请确认网络和钱包地址。",
      network: "网络",
      userUid: "用户 UID",
      liveRate: "实时汇率",
      loadingRate: "正在加载汇率...",
      estimated: "预计到账",
      updated: "更新时间",
      copy: "复制",
      copyAddress: "复制地址",
      viewQrCopyAddress: "查看二维码并复制地址",

      confirmApprove: "确认通过这笔提现吗？",
      confirmReject: "确认拒绝这笔提现并退回余额吗？",
      rejectReasonPrompt: "拒绝原因？（可选）",
      confirmDeleteRecentAddress: "确认删除这条最近提现地址记录吗？",

      failedLoadWithdrawals: "加载提现记录失败",
      failedLoadRecentAddresses: "加载最近地址失败",
      approveFailed: "通过失败",
      rejectFailed: "拒绝失败",
      deleteFailed: "删除失败",
      updateFailed: "更新失败",

      approvedSuccess: "提现已通过",
      rejectedSuccess: "提现已拒绝",
      recentAddressUpdated: "最近地址已更新",
      recentAddressDeleted: "最近地址已删除",

      copied: "已复制",
      copyFailed: "复制失败",

      noWalletAddress: "未找到钱包地址",
      addressMinLength: "地址至少需要 8 个字符",

      coinGeckoFailed: "CoinGecko 价格接口失败",
      incompleteRates: "CoinGecko 返回的 EUR 汇率不完整",
      unableLoadRates: "无法从 CoinGecko 加载实时币价",
      rateUnavailable: "汇率不可用",
    },

    deposits: {
      title: "充值记录",
      subtitle: "最新记录在前 • 每页 10 条 • 管理员加减余额记录",

      deposits: "充值记录",
      loading: "加载中...",
      refresh: "刷新",

      total: "总数",
      today: "今日",
      showing: "显示",
      amount: "金额",
      of: "共",
      page: "页码",
      totalPages: "总页数",

      search: "搜索",
      searchPlaceholder: "搜索 UID / 充值 ID / 类型 / 备注...",
      apply: "应用",
      clearFilters: "清除筛选",

      date: "日期",
      type: "类型",
      user: "用户",
      before: "之前余额",
      after: "之后余额",
      note: "备注",
      unknown: "未知",

      noDepositsFound: "未找到充值记录。",

      first: "首页",
      prev: "上一页",
      next: "下一页",
      last: "末页",

      failedLoad: "加载充值记录失败",
    },

    trialBonus: {
      title: "体验金",

      grantAnyUserTitle: "给任意用户发放体验金",
      searchAnyUserLabel: "通过 UID / 手机号 / 用户 ID 搜索用户",
      typeAtLeastTwo: "请输入至少 2 个字符...",

      uid: "UID",
      phone: "手机号",
      userId: "用户 ID",
      action: "操作",
      actions: "操作",

      loadingUsers: "正在加载用户...",
      noUsersFound: "未找到用户。",
      grantTrial: "发放体验金",

      recordsTitle: "体验金记录",
      recordsSubtitle: "已拥有体验金记录的用户分页列表。",
      searchTrialRecordsLabel: "通过 UID / 手机号搜索体验金记录",
      searchTrialRecordsPlaceholder: "搜索 UID / 手机号...",

      loading: "加载中...",
      refresh: "刷新",
      totalTrialUsers: "个体验金用户",

      trialStatus: "体验金状态",
      credited: "已发放",
      reversed: "已撤回",
      remaining: "剩余",
      lastCredit: "最后发放",
      lastReversal: "最后撤回",

      active: "生效中",
      revoked: "已撤回",
      none: "无",

      loadingTrialUsers: "正在加载体验金用户...",
      noTrialUsersFound: "未找到体验金用户。",

      grant: "发放",
      revoke: "撤回",

      showing: "显示",
      to: "到",
      of: "共",
      rows: "行",
      perPage: "每页",
      prev: "上一页",
      next: "下一页",
      page: "页码",

      grantTrialBonus: "发放体验金",
      revokeTrialBonus: "撤回体验金",
      cancel: "取消",
      amount: "金额",
      note: "备注",
      amountPlaceholder: "例如：300",
      defaultGrantNote: "体验金",

      grantPreventDuplicate: "后端会防止同一用户重复发放体验金。",
      revokeRemaining: "撤回剩余体验金",
      revokeOnlyRemaining: "这只会撤回剩余体验金，不会影响用户已赚取余额。",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",
      failedLoadTrialUsers: "加载体验金用户失败",
      failedLoadUsers: "加载用户失败",
      amountGreaterThanZero: "金额必须大于 0",
      grantedSuccess: "体验金已发放",
      failedGrant: "发放体验金失败",
      revokedSuccess: "体验金已撤回",
      failedRevoke: "撤回体验金失败",
    },

    bonusCredit: {
      title: "彩金加款",
      subtitle: "默认显示所有用户的彩金记录。搜索 UID 可给指定用户加彩金。",

      backToUsers: "返回用户管理",
      refresh: "刷新",

      searchUserByUid: "通过 UID 搜索用户",
      uidPlaceholder: "例如：100008",
      searching: "搜索中...",
      searchUser: "搜索用户",
      clear: "清除",

      userDetails: "用户详情",
      noUserSelected: "未选择用户。下方历史记录显示所有用户。",
      currentBalance: "当前余额",

      creditBonus: "发放彩金",
      amount: "金额",
      amountPlaceholder: "例如：100",
      note: "备注",
      notePlaceholder: "例如：欢迎彩金 / 活动奖励 / 补偿",
      crediting: "发放中...",

      historyTitle: "彩金加款记录",
      searchNotePlaceholder: "搜索备注...",
      search: "搜索",

      created: "创建时间",
      type: "类型",
      before: "之前余额",
      after: "之后余额",

      loadingHistory: "正在加载记录...",
      noHistoryFound: "未找到彩金记录。",

      showing: "显示",
      to: "到",
      of: "共",
      prev: "上一页",
      next: "下一页",
      page: "页码",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",
      failedLoadHistory: "加载彩金记录失败",
      searchSelectUserFirst: "请先通过 UID 搜索并选择用户",
      validBonusAmount: "请输入有效的彩金金额",
      creditedSuccess: "彩金发放成功",
      failedCreditBonus: "发放彩金失败",
    },

    referralUsers: {
      title: "推荐用户",
      subtitle: "查看用户的邀请码、推荐人和注册日期",

      searchPlaceholder: "搜索手机号 / 邀请码 / 推荐人...",
      allUsers: "所有用户",
      hasReferrer: "有推荐人",
      noReferrer: "无推荐人",
      newest: "最新",
      oldest: "最旧",
      refresh: "刷新",

      totalUsers: "用户总数",
      topReferrerThisWeek: "本周最佳推荐人",
      code: "邀请码",
      referral: "推荐",
      referrals: "推荐",
      noReferralsThisWeek: "本周暂无推荐",

      phoneNumber: "手机号",
      referralCode: "邀请码",
      referredBy: "推荐人",
      referralCount: "推荐数量",
      createdDate: "创建日期",

      loadingUsers: "正在加载用户...",
      noUsersFound: "未找到用户。",

      showing: "显示",
      of: "共",
      prev: "上一页",
      next: "下一页",
      page: "页码",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",
      failedLoadUsers: "加载用户失败",
    },

    luckyDraw: {
      title: "幸运抽奖触发设置",

      assignTitle: "设置幸运抽奖触发",
      assignSubtitle:
        "设置触发订单数和固定奖励。用户视觉上选择 1 个蛋，但实际奖励是你在这里设置的奖励。",
      uidPlaceholder: "在这里粘贴 UID...",
      userCurrentOrder: "用户当前订单数",
      triggerOrderCount: "触发订单数",
      popupTitle: "弹窗标题",
      popupDescription: "弹窗描述",
      descriptionPlaceholder: "选择 1 个钻石并赢取奖励",

      rewardType: "奖励类型",
      cashReward: "现金奖励",
      bonusOrder: "奖励订单",
      cashAmount: "现金金额",
      cashAmountPlaceholder: "输入现金金额",
      selectBonusOrder: "选择奖励订单",
      clickChooseOrder: "点击选择订单...",
      price: "价格",

      bonusOrderCommissionRate: "奖励订单佣金比例",
      ratePlaceholder: "留空 = 使用全局比例，例如 0.15 = 15%",
      decimalFormatTip:
        "使用小数格式。例如：0.15 = 15%，0.10 = 10%，0.05 = 5%。",

      saving: "正在保存...",
      saveRule: "保存幸运抽奖规则",

      savedRules: "已保存的幸运抽奖规则",
      savedRulesSubtitle: "显示每个触发订单数对应的固定奖励规则。",
      refresh: "刷新",
      loadingRules: "正在加载幸运抽奖规则...",
      noRules: "该用户暂无幸运抽奖规则。",

      triggerAtOrder: "触发订单数",
      reward: "奖励",
      cash: "现金",
      unknownOrder: "未知订单",
      rate: "比例",
      globalRate: "全局比例",
      rule: "规则",
      on: "开启",
      off: "关闭",
      claimed: "已领取",
      yes: "是",
      no: "否",
      pickedEgg: "选择的蛋",
      ruleTitle: "标题",
      claimedAt: "领取时间",
      notClaimedYet: "尚未领取",

      activeStatus: "生效中",
      claimedStatus: "已领取",
      disabledStatus: "已禁用",

      disable: "禁用",
      delete: "删除",
      cancel: "取消",
      deleting: "正在删除...",
      disabling: "正在禁用...",

      drawerSubtitle: "可按价格范围和搜索筛选。仅显示启用中的订单池订单。",
      searchNameNumber: "搜索名称 / 编号...",
      minPrice: "最低价格",
      maxPrice: "最高价格",
      showingFirst100:
        "显示 {{count}} 个匹配订单中的前 100 个。请使用搜索或价格范围缩小结果。",
      noActivePoolOrders: "未找到启用中的订单池订单。",

      deleteRuleTitle: "删除幸运抽奖规则",
      disableRuleTitle: "禁用幸运抽奖规则",
      deleteRuleSubtitle: "这将永久删除该幸运抽奖规则。",
      disableRuleSubtitle: "这将关闭该幸运抽奖规则，使其无法再次触发。",
      deletePermanentWarning: "此操作是永久性的，无法撤销。",
      disableHistoryWarning: "该规则会保留在历史记录中，但不会再触发。",

      fillRequired: "请填写 UID、触发订单数和奖励类型。",
      validCashAmount: "请输入有效的现金金额。",
      chooseBonusOrder: "请选择奖励订单。",
      rateNumberAboveZero: "奖励订单佣金比例必须是 0 或以上的数字。",
      useDecimalFormat: "请使用小数格式。例如：0.15 = 15%。",

      ruleSaved: "幸运抽奖规则已保存",
      failedSaveRule: "保存幸运抽奖规则失败",
      serverErrorSaving: "服务器保存幸运抽奖规则时出错。",
      failedFetchRules: "获取幸运抽奖规则失败",
      failedDisableRule: "禁用幸运抽奖规则失败",
      failedDeleteRule: "删除幸运抽奖规则失败",
      ruleDisabled: "幸运抽奖规则已禁用",
      ruleDeleted: "幸运抽奖规则已删除",
    },

    bonusTriggers: {
      title: "奖励订单触发设置",

      assignTitle: "设置奖励订单触发",
      assignSubtitle: "从更多弹窗进入会自动填入 UID，但你也可以手动修改。",
      uidPlaceholder: "在这里粘贴 UID...",
      userCurrentOrder: "用户当前订单数",
      triggerOrderCount: "触发订单数",
      selectPoolOrder: "选择订单池订单",
      clickChooseOrder: "点击选择订单...",
      price: "价格",

      overrideDefaultCommission: "覆盖默认奖励订单佣金 %",
      customCommissionRate: "自定义佣金比例",
      customRatePlaceholder: "例如：0.10 = 10%",
      decimalTip: "以小数保存。例如：0.10 = 10%",
      saving: "正在保存...",
      saveTrigger: "保存奖励触发",

      savedBonusOrders: "已保存的奖励订单",
      savedSubtitle: "显示用户是否已触发，或该奖励是否待处理/已完成。",
      refresh: "刷新",
      loadingBonusList: "正在加载奖励列表...",
      noBonusTriggers: "该用户暂无奖励触发规则。",

      unknownOrder: "未知订单",
      triggerAt: "触发于",
      commission: "佣金",
      custom: "自定义",
      global: "全局",
      rule: "规则",
      on: "开启",
      off: "关闭",

      activeStatus: "生效中",
      inactiveStatus: "未启用",
      pendingStatus: "待处理",
      completedStatus: "已完成",

      disable: "禁用",
      delete: "删除",
      cancel: "取消",
      close: "关闭",
      processing: "处理中...",

      selectBonusOrder: "选择奖励订单",
      drawerSubtitle: "可按价格范围和搜索筛选。仅显示启用中的订单池订单。",
      searchNameNumber: "搜索名称 / 编号...",
      minPrice: "最低价格",
      maxPrice: "最高价格",
      showingFirst100:
        "显示 {{count}} 个匹配订单中的前 100 个。请使用搜索或价格范围缩小结果。",
      noMatchingOrders: "未找到匹配订单。",

      deleteRuleTitle: "删除奖励规则",
      disableRuleTitle: "禁用奖励规则",
      deleteRuleMessage: "这将永久删除该奖励规则。",
      disableRuleMessage: "这将关闭该奖励规则，使其无法再次触发。",

      fillAllFields: "请填写所有字段。",
      validCustomRate: "请输入有效的自定义佣金比例。",
      useDecimalFormat: "请使用小数格式。例如：0.15 = 15%。",

      savedSuccess: "奖励触发已保存",
      failedSave: "保存奖励触发失败",
      serverErrorSaving: "服务器保存奖励触发时出错。",
      failedFetchBonusList: "获取奖励列表失败",
      failedDisable: "禁用奖励规则失败",
      failedDelete: "删除奖励规则失败",
      disabledSuccess: "奖励规则已禁用",
      deletedSuccess: "奖励规则已删除",
    },

    orderList: {
      title: "管理员订单列表",
      subtitle: "查看指定用户的订单历史，支持服务器分页和状态筛选",

      back: "返回",
      refresh: "刷新",
      refreshing: "正在刷新...",
      loading: "加载中...",

      filters: "筛选",
      pasteUid: "粘贴 UID",
      status: "状态",
      allStatuses: "全部状态",
      pendingCaps: "待处理",
      completedCaps: "已完成",
      searchLoadedRows: "搜索已加载记录",
      searchPlaceholder: "订单号 / 名称 / 状态",
      perPage: "每页",
      loadOrders: "加载订单",
      clear: "清除",

      pickedUser: "选中的用户",
      phone: "手机号",

      loadedOrders: "已加载订单",
      pending: "待处理",
      completed: "已完成",
      bonusOrders: "奖励订单",
      totalPrice: "总价格",
      totalCommission: "总佣金",

      orders: "订单",
      orderNumber: "订单号",
      orderName: "订单名称",
      price: "价格",
      commission: "佣金",
      bonus: "奖励",
      created: "创建时间",
      poolOrderId: "订单池 ID",
      orderId: "订单 ID",

      yes: "是",
      no: "否",

      loadingOrders: "正在加载订单...",
      noOrdersFound: "该用户 / 筛选条件下未找到订单。",
      enterUserLoadOrders: "请输入用户 ID 并加载订单。",

      showing: "显示",
      localRows: "条本地记录",
      serverTotal: "服务器总数",
      page: "页码",
      prev: "上一页",
      next: "下一页",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",
      enterUserIdFirst: "请先输入用户 ID",
      failedLoad: "加载订单列表失败",
    },

    popups: {
      popupManagement: "弹窗管理",
      userNotifications: "用户通知",
      communicationCenter: "管理员通信中心",

      popupDescription: "创建平台公告弹窗，可发送给所有用户或指定用户。",
      notificationDescription: "创建显示在用户前端通知区域的用户通知。",

      popup: "弹窗",
      notification: "通知",
      refresh: "刷新",
      newPopup: "+ 新建弹窗",
      newNotification: "+ 新建通知",

      searchPopups: "搜索弹窗...",
      searchNotifications: "搜索通知...",

      popups: "弹窗",
      notifications: "通知",
      popupControlCenter: "弹窗控制中心",
      notificationControlCenter: "用户通知控制中心",

      title: "标题",
      message: "内容",
      description: "描述",
      target: "目标",
      users: "用户",
      status: "状态",
      created: "创建时间",
      actions: "操作",

      specificUsers: "指定用户",
      specificUser: "指定用户",
      allUsers: "所有用户",
      everyone: "所有人",
      selected: "已选择",
      selectedLower: "已选择",
      select: "选择",

      active: "启用",
      inactive: "未启用",
      disabled: "已禁用",
      edit: "编辑",
      activate: "启用",
      deactivate: "停用",
      delete: "删除",
      disable: "禁用",

      loadingPopups: "正在加载弹窗...",
      loadingNotifications: "正在加载通知...",
      noPopupsFound: "未找到弹窗。",
      noNotificationsFound: "未找到通知。",

      createNotification: "创建通知",
      createPopup: "创建弹窗",
      editPopup: "编辑弹窗",
      createNotificationSubtitle: "发送通知给所有用户或一个指定用户",
      createPopupSubtitle: "创建用户全局弹窗",
      editingPopup: "正在编辑弹窗 {{id}}",

      cancel: "取消",
      creating: "正在创建...",
      saving: "正在保存...",
      saveChanges: "保存更改",

      notificationContent: "通知内容",
      popupContent: "弹窗内容",
      audience: "发送对象",

      notificationTitlePlaceholder: "例如：充值成功",
      notificationDescriptionPlaceholder: "在这里输入通知描述...",
      popupTitlePlaceholder: "例如：重要安全通知",
      popupMessagePlaceholder: "在这里输入弹窗内容...",

      sendNotificationEveryone: "发送此通知给所有用户",
      sendNotificationOneUser: "发送此通知给一个指定用户",
      showPopupEveryone: "向所有用户显示此弹窗",
      pickPopupSpecific: "选择哪些用户可以看到此弹窗",

      searchUsers: "搜索用户",
      searchUsersPlaceholder: "搜索手机号 / UID / 用户 ID...",
      searchUidPhone: "搜索 UID / 手机号...",
      pickUsers: "选择用户",
      pickUser: "选择用户",
      noUsersFound: "未找到用户",
      selectedUserIds: "已选择用户 ID",
      selectedUser: "已选择用户",
      selectedUsers: "已选择用户",
      noUserSelected: "未选择用户",
      noUsersSelected: "未选择用户",
      total: "总数",
      phone: "手机号",
      remove: "移除",

      usersCanReceive: "用户现在可以收到此弹窗",
      savedButHidden: "已保存，但启用前不会显示",
      on: "开启",
      off: "关闭",

      quickTips: "快速提示",
      notificationTip1: "通知会显示在用户前端",
      notificationTip2: "所有用户适合平台公告",
      notificationTip3: "指定用户适合手动账户通知",
      notificationTip4: "标题保持简短，描述保持清楚",
      popupTip1: "标题最好简短直接",
      popupTip2: "内容尽量控制在 5 行以内",
      popupTip3: "指定用户适合手动定向发送",
      popupTip4: "如果想先保存后发布，请设为未启用",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",
      failedLoadPage: "加载页面失败",

      titleRequired: "标题不能为空",
      messageRequired: "内容不能为空",
      pickAtLeastOneUser: "请至少选择 1 个用户",
      notificationTitleRequired: "通知标题不能为空",
      notificationDescriptionRequired: "通知描述不能为空",
      pickUserNotification: "请选择此通知的用户",

      popupCreated: "弹窗已创建",
      popupUpdated: "弹窗已更新",
      popupActivated: "弹窗已启用",
      popupDeactivated: "弹窗已停用",
      popupDeleted: "弹窗已删除",
      notificationCreated: "通知已创建",
      notificationDisabled: "通知已禁用",

      failedSavePopup: "保存弹窗失败",
      failedUpdatePopup: "更新弹窗失败",
      failedDeletePopup: "删除弹窗失败",
      failedCreateNotification: "创建通知失败",
      failedDisableNotification: "禁用通知失败",

      confirmDeletePopup: "确认删除弹窗「{{title}}」吗？",
      confirmDisableNotification: "确认禁用通知「{{title}}」吗？",
    },

    orderPool: {
      title: "订单池设置",

      addHotelOrder: "新增酒店订单",
      addHotelOrderDesc: "创建用户在搜索酒店时会随机收到的订单。",
      total: "总数",
      active: "启用",
      inactive: "未启用",

      orderNumberPlaceholder: "订单编号（唯一）",
      hotelNamePlaceholder: "酒店名称",
      price: "价格",
      imageKeyOptional: "图片 Key（可选）",
      fallbackImageUrlOptional: "备用图片 URL（可选）",
      adding: "正在添加...",
      addOrder: "添加订单",

      bulkAdd: "批量添加",
      bulkFormat: "格式：",
      bulkFormatExample: "订单编号, 酒店名称, 价格, 图片Key",
      importing: "正在导入...",
      importBulkOrders: "导入批量订单",
      clear: "清除",

      imageKeys: "图片 Key",
      imageKeysDesc: "一个 Key 可以控制多个订单。例如：",
      imageKeysExample: "酒店 → 一个图片 URL",
      keys: "Key 数量",
      keyPlaceholder: "Key（例如：jwmarriott）",
      key: "Key",
      imageUrl: "图片 URL",
      saving: "正在保存...",
      save: "保存",
      addImageKey: "添加图片 Key",
      searchImageKeys: "按 Key、URL 或启用状态搜索图片 Key...",
      perPage: "每页",
      showing: "显示",
      of: "共",
      yes: "是",
      no: "否",
      edit: "编辑",
      delete: "删除",
      cancel: "取消",
      noImage: "无图片",
      noImageKeysFound: "未找到图片 Key。",

      sort: "排序",
      none: "无",
      priceLowHigh: "价格：低 → 高",
      priceHighLow: "价格：高 → 低",
      searchOrders: "按订单名称、编号、Key 或 URL 搜索...",
      toggle: "切换",
      noOrdersFound: "未找到订单。",

      prev: "上一页",
      next: "下一页",
      page: "页码",

      editHotelOrder: "编辑酒店订单",
      editHotelOrderDesc: "更新订单详情、Key 和备用图片",
      orderNumber: "订单编号",
      orderName: "订单名称",
      imageKey: "图片 Key",
      fallbackImageUrl: "备用图片 URL",
      saveChanges: "保存更改",

      imageKeyPreview: "图片 Key 预览",
      hotelPreview: "酒店预览",

      failedLoadOrders: "加载订单失败",
      failedLoadImageKeys: "加载图片 Key 失败",
      orderCreated: "订单已创建",
      failedCreateOrder: "创建订单失败",
      failedUpdateOrderStatus: "更新订单状态失败",
      orderStatusUpdated: "订单状态已更新",
      failedUpdateOrder: "更新订单失败",
      orderUpdated: "订单已更新",
      confirmDeleteOrder: "确认永久删除此酒店订单吗？",
      failedDeleteOrder: "删除订单失败",
      orderDeleted: "订单已删除",

      bulkMissingFields: '第 {{line}} 行：字段缺失 → "{{raw}}"',
      bulkInvalidPrice: '第 {{line}} 行：价格无效 → "{{raw}}"',
      nothingValidImport: "没有有效内容可导入。",
      imported: "✅ 已导入",
      failed: "❌ 失败",
      skippedLines: "⚠️ 已跳过行",
      failedOrders: "❌ 失败订单",
      networkError: "网络错误",
      importedOrders: "已导入 {{count}} 个订单",
      someBulkFailed: "部分批量订单导入失败",

      failedCreateImageKey: "创建图片 Key 失败",
      imageKeyCreated: "图片 Key 已创建",
      failedUpdateImageKey: "更新图片 Key 失败",
      imageKeyUpdated: "图片 Key 已更新",
      confirmDeleteImageKey: "确认删除此图片 Key 吗？",
      failedDeleteImageKey: "删除图片 Key 失败",
      imageKeyDeleted: "图片 Key 已删除",
    },

    signinRewards: {
      title: "签到奖励",
      subtitle: "查看用户签到奖励领取记录，并管理奖励金额（第 1 天 → 第 6 天）",

      searchPlaceholder: "搜索手机号 / 用户 ID / 日期...",
      refresh: "刷新",

      rewardPrices: "签到奖励金额",
      rewardPricesDesc:
        "编辑第 1 天到第 6 天的金额。用户领取时会使用这些数值。",
      reload: "重新加载",
      savePrices: "保存金额",
      day: "第",
      dayOneTip: "提示：如果你只想发放第 1 天奖励，可将第 2–第 6 天设为 0。",

      totalClaims: "领取总数",
      uniqueUsers: "独立用户数",
      totalRewardAmount: "奖励总金额",

      filterUserId: "筛选用户 ID",
      optionalUserId: "可选用户 ID...",
      fromDate: "开始日期（ET）",
      toDate: "结束日期（ET）",
      apply: "应用",
      filtersUseEt: "筛选使用美国东部时间日期字符串",
      clear: "清除",

      claims: "领取记录",
      user: "用户 UID",
      etDate: "ET 日期",
      streakDay: "连续签到天数",
      reward: "奖励",
      ordersCompleted: "已完成订单",
      createdAt: "创建时间",

      loadingClaims: "正在加载领取记录...",
      noClaimsFound: "未找到领取记录。",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",

      loadedClaims: "签到奖励领取记录已加载",
      failedLoadClaims: "加载签到领取记录失败",
      loadedRewardPrices: "奖励金额已加载",
      failedLoadRewardConfig: "加载奖励配置失败",
      rewardPricesUpdated: "奖励金额更新成功",
      failedUpdateRewardPrices: "更新奖励金额失败",
    },

    settings: {
      title: "设置 • VIP 与奖励",
      vipBonusSettings: "VIP 与奖励设置",

      safetyNoticeTitle: "仪表板安全提醒",
      safetyNoticeDesc:
        "这里用于控制用户仪表板上显示的安全提醒。保存更改后，提醒版本会增加，用户将会再次看到该提醒。",
      enableSafetyNotice: "启用安全提醒",
      noticeLabel: "标签",
      noticeLabelPlaceholder: "安全提醒",
      noticeVersion: "版本",
      currentVersion: "当前版本：v{{version}}",
      noticeTitleInput: "标题",
      noticeTitlePlaceholder: "请警惕虚假的招聘页面",
      noticeDescriptionInput: "描述",
      noticeDescriptionPlaceholder: "请仅使用官方平台...",
      saveSafetyNotice: "保存安全提醒",
      failedLoadSafetyNotice: "无法加载安全提醒",
      failedSaveSafetyNotice: "无法保存安全提醒",
      safetyNoticeSaved: "安全提醒已保存",
      safetyNoticeTitleRequired: "安全提醒标题为必填项",
      safetyNoticeDescriptionRequired: "安全提醒描述为必填项",

      description:
        "设置全局奖励订单佣金比例，以及每个 VIP 等级的普通订单佣金比例。",
      example: "例如：0.01 = 1%，0.1 = 10%",

      bonusOrderCommissionRate: "奖励订单佣金比例",
      bonusOrderCommissionRateDesc: "当订单被标记为奖励订单时使用的全局比例",

      rank: "等级",
      ordersLimit: "订单上限",
      normalCommissionRate: "普通订单佣金比例",

      refresh: "刷新",
      saving: "正在保存...",
      saveSettings: "保存设置",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",

      failedLoadVipConfig: "加载 VIP 配置失败",
      failedSaveVipConfig: "保存 VIP 配置失败",
      savedSuccess: "VIP 与奖励设置已保存",

      bonusRateValidation: "bonusCommissionRate 必须在 0 到 1 之间（例如 0.1）",
      rankValidation: "等级必须是 1、2 或 3",
      ordersLimitValidation: "等级 {{rank}}：订单上限必须 >= 1",
      commissionRateValidation: "等级 {{rank}}：佣金比例必须在 0 到 1 之间",
    },

    content: {
      title: "内容管理",
      subtitle: "管理用户设置页面中的条款、隐私与安全、平台规则内容。",

      termsConditions: "条款与条件",
      privacySecurity: "隐私与安全",
      platformRules: "平台规则",

      loadingContent: "正在加载内容...",

      pageTitle: "标题",
      pageTitlePlaceholder: "输入页面标题",
      version: "版本",
      lastUpdated: "最后更新",
      published: "已发布",
      hidden: "已隐藏",
      publishedDesc: "如果关闭，公开页面将不会返回此内容",

      summary: "摘要",
      summaryPlaceholder: "简短页面摘要",

      sections: "内容章节",
      addSection: "+ 添加章节",
      section: "章节",
      remove: "移除",
      heading: "标题",
      headingPlaceholder: "例如：1. 接受条款",
      paragraphs: "段落",
      paragraphsDesc: "用一个空行分隔段落",
      paragraphsPlaceholder: "第一段...\n\n第二段...",

      refresh: "刷新",
      saving: "正在保存...",
      saveContent: "保存内容",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",
      failedLoadContent: "加载内容失败",
      titleRequired: "标题不能为空。",
      contentSaved: "内容保存成功",
      failedSaveContent: "保存内容失败",
    },

    events: {
      title: "活动管理",
      subtitle: "管理用户活动页面的活动横幅、标题和描述。",

      searchPlaceholder: "搜索活动名称 / 描述 / ID...",
      refresh: "刷新",
      addEvent: "+ 添加活动",

      events: "活动",
      preview: "预览",
      event: "活动",
      description: "描述",
      actions: "操作",

      loadingEvents: "正在加载活动...",
      noEventsFound: "未找到活动。",

      edit: "编辑",
      delete: "删除",
      cancel: "取消",
      create: "创建",
      saving: "正在保存...",
      deleting: "正在删除...",
      saveChanges: "保存更改",

      addEventTitle: "添加活动",
      createEventSubtitle: "创建新活动",
      editEventTitle: "编辑活动",
      deleteEventTitle: "删除活动",
      eventId: "活动 ID",
      untitled: "未命名",

      eventName: "活动名称",
      eventNamePlaceholder: "例如：新年促销",
      uploadImage: "上传图片",
      uploadNewImage: "上传新图片",
      uploadImageDesc: "从电脑选择图片。下方也可填写备用图片 URL。",
      uploadNewImageDesc: "留空则保留当前图片，或在下方填写手动图片 URL。",
      imageUrl: "图片 URL",
      imageUrlOptional: "图片 URL（可选）",
      descriptionPlaceholder: "输入活动描述...",

      deletePermanentWarning: "此操作是永久性的，无法撤销。",
      deleteEventDesc: "请确认你确实要从用户页面移除此活动。",

      pleaseLoginAgain: "请重新登录。",
      nonJson: "服务器返回了非 JSON 响应。",
      requestFailed: "请求失败",

      failedLoadEvents: "加载活动失败",
      fillRequired: "请填写名称、描述，并选择图片或填写图片 URL。",
      eventCreated: "活动已创建",
      failedCreateEvent: "创建活动失败",
      eventUpdated: "活动已更新",
      failedUpdateEvent: "更新活动失败",
      eventDeleted: "活动已删除",
      failedDeleteEvent: "删除活动失败",
    },
  },
};

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  function setLanguage(nextLanguage) {
    if (!["en", "zh"].includes(nextLanguage)) return;
    setLanguageState(nextLanguage);
  }

  function toggleLanguage() {
    setLanguageState((prev) => (prev === "en" ? "zh" : "en"));
  }

  function t(key, values = {}) {
    let text =
      getNestedValue(translations[language], key) ||
      getNestedValue(translations.en, key) ||
      key;

    Object.entries(values).forEach(([name, value]) => {
      text = text.replaceAll(`{{${name}}}`, String(value));
    });

    return text;
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
