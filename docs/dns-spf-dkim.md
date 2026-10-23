# SPF / DKIM / DMARC for hq@ww2andallthat.com

Add these DNS records at Network Solutions to enable sending from hq@ww2andallthat.com via Ghost.

Ghost(Pro) provides the exact values in **Ghost Admin > Settings > Email newsletter > Custom sending domain**.
Use the values from Ghost — do not use the placeholders below verbatim.

---

## Records to add

### SPF (TXT on @)
Allow Ghost's mail servers to send on behalf of ww2andallthat.com:

```
Type:  TXT
Host:  @
Value: v=spf1 include:sendgrid.net include:mg.ww2andallthat.com ~all
TTL:   3600
```

*(Ghost(Pro) uses SendGrid — confirm the exact include value in Ghost Admin)*

### DKIM (CNAME or TXT on mail._domainkey)
```
Type:  CNAME
Host:  mail._domainkey
Value: [provided by Ghost Admin]
TTL:   3600
```

### DMARC (TXT on _dmarc)
```
Type:  TXT
Host:  _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@ww2andallthat.com; pct=100
TTL:   3600
```

### MX (if routing inbound mail to hq@)
```
Type:  MX
Host:  @
Value: [your mail host MX record]
TTL:   3600
```

---

## Steps

1. Open Ghost Admin > Settings > Email newsletter > Custom sending domain
2. Enter: `hq@ww2andallthat.com`
3. Ghost shows the exact TXT/CNAME values to add
4. Add each record at Network Solutions DNS manager
5. Return to Ghost Admin and click "Verify" — usually propagates within 30 min

---

## After verification

Ghost will send all newsletter emails from `hq@ww2andallthat.com` instead of the Ghost default.
Reply-to address can be set separately to `james@ww2andallthat.com` or similar.
