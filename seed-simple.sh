#!/bin/bash
# Simplified seed using ONLY columns that exist in members table

CHURCH_ID="AaS4Pjqrw5viy04ky14Jv"

echo "🚀 SEEDING 2000 MEMBERS - Simplified Version"
echo "==============================================================="

# Check existing
EXISTING=$(PGPASSWORD='Bendecido100%$$%' psql \
  -h aws-1-us-east-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.qxdwpihcmgctznvdfmbv \
  -d postgres \
  -t -c "SELECT COUNT(*) FROM members WHERE \"churchId\" = '$CHURCH_ID'")

echo "Existing members: $EXISTING"

TO_CREATE=$((2000 - EXISTING))
if [ $TO_CREATE -le 0 ]; then
  echo "✅ Already have 2000+ members!"
  exit 0
fi

echo "Creating $TO_CREATE members..."

# Name arrays
MALE=("Juan" "Carlos" "José" "Miguel" "David" "Diego" "Andrés" "Pedro" "Luis" "Fernando")
FEMALE=("María" "Carmen" "Ana" "Isabel" "Laura" "Patricia" "Rosa" "Andrea" "Diana" "Carolina")
LAST=("García" "Rodríguez" "Martínez" "López" "González" "Pérez" "Sánchez" "Ramírez" "Torres" "Flores")

BATCH_SIZE=100
BATCHES=$(( (TO_CREATE + BATCH_SIZE - 1) / BATCH_SIZE ))

for ((batch=0; batch<BATCHES; batch++)); do
  START=$((batch * BATCH_SIZE))
  END=$((START + BATCH_SIZE))
  [ $END -gt $TO_CREATE ] && END=$TO_CREATE
  
  echo -n "Batch $(($batch + 1))/$BATCHES... "
  
  SQL="INSERT INTO members (id, \"firstName\", \"lastName\", email, phone, gender, \"birthDate\", address, city, state, \"zipCode\", \"membershipDate\", \"churchId\", \"isActive\") VALUES "
  
  for ((i=START; i<END; i++)); do
    IDX=$((i + EXISTING))
    
    if [ $((RANDOM % 2)) -eq 0 ]; then
      GENDER="M"
      FIRST=${MALE[$((RANDOM % 10))]}
    else
      GENDER="F"
      FIRST=${FEMALE[$((RANDOM % 10))]}
    fi
    
    LAST_NAME="${LAST[$((RANDOM % 10))]} ${LAST[$((RANDOM % 10))]}"
    
    # Clean names for email
    F_CLEAN=$(echo "$FIRST" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null | tr '[:upper:]' '[:lower:]' | tr -d '\n' || echo "$FIRST" | tr '[:upper:]' '[:lower:]')
    L_CLEAN=$(echo "${LAST_NAME%% *}" | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null | tr '[:upper:]' '[:lower:]' | tr -d '\n' || echo "${LAST_NAME%% *}" | tr '[:upper:]' '[:lower:]')
    
    EMAIL="${F_CLEAN}.${L_CLEAN}${IDX}@hillsong.com"
    PHONE="+57 3$((10 + RANDOM % 10)) $((100 + RANDOM % 900)) $((1000 + RANDOM % 9000))"
    ADDRESS="Calle $((1 + RANDOM % 200)) #$((10 + RANDOM % 90))-$((10 + RANDOM % 90))"
    ZIP=$((80000 + RANDOM % 1000))
    
    BIRTH_YEAR=$((1950 + RANDOM % 60))
    BIRTH_MONTH=$(printf "%02d" $((1 + RANDOM % 12)))
    BIRTH_DAY=$(printf "%02d" $((1 + RANDOM % 28)))
    BIRTH_DATE="$BIRTH_YEAR-$BIRTH_MONTH-$BIRTH_DAY"
    
    JOIN_YEAR=$((2018 + RANDOM % 8))
    JOIN_MONTH=$(printf "%02d" $((1 + RANDOM % 12)))
    JOIN_DAY=$(printf "%02d" $((1 + RANDOM % 28)))
    JOIN_DATE="$JOIN_YEAR-$JOIN_MONTH-$JOIN_DAY"
    
    ID="member-$(date +%s%N | md5sum | head -c 12)-${IDX}"
    
    [ $i -gt $START ] && SQL+=","
    SQL+="('$ID','$FIRST','$LAST_NAME','$EMAIL','$PHONE','$GENDER','$BIRTH_DATE','$ADDRESS','Barranquilla','Atlántico','$ZIP','$JOIN_DATE','$CHURCH_ID',true)"
  done
  
  SQL+=";"
  
  PGPASSWORD='Bendecido100%$$%' psql \
    -h aws-1-us-east-1.pooler.supabase.com \
    -p 6543 \
    -U postgres.qxdwpihcmgctznvdfmbv \
    -d postgres \
    -c "$SQL" 2>&1 | grep -q "ERROR" && echo "❌ Error" || echo "✅"
done

# Final count
FINAL=$(PGPASSWORD='Bendecido100%$$%' psql \
  -h aws-1-us-east-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.qxdwpihcmgctznvdfmbv \
  -d postgres \
  -t -c "SELECT COUNT(*) FROM members WHERE \"churchId\" = '$CHURCH_ID'")

echo ""
echo "==============================================================="
echo "🎉 COMPLETE!"
echo "==============================================================="
echo "Total members: $FINAL"
echo ""
